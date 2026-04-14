using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.FileProviders;
using BCrypt.Net;

var builder = WebApplication.CreateBuilder(args);

// ── Port from env ──────────────────────────────────────────────
var port = Environment.GetEnvironmentVariable("PORT") ?? "3001";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// ── JSON options ───────────────────────────────────────────────
var jsonOpts = new JsonSerializerOptions
{
    PropertyNamingPolicy        = JsonNamingPolicy.CamelCase,
    PropertyNameCaseInsensitive = true,
    WriteIndented               = true,
    DefaultIgnoreCondition      = JsonIgnoreCondition.WhenWritingNull
};

// ── CORS — restrict to localhost origins only (API is accessed via proxy) ──
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.SetIsOriginAllowed(origin =>
    {
        var uri = new Uri(origin);
        return uri.Host == "localhost" || uri.Host == "127.0.0.1";
    })
     .AllowAnyHeader()
     .AllowAnyMethod()
     .AllowCredentials()));

// ── Session (cookie-based, in-memory) ─────────────────────────
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(o =>
{
    o.Cookie.Name         = "skinz_session";
    o.Cookie.HttpOnly     = true;
    o.Cookie.SameSite     = SameSiteMode.Lax;
    o.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    o.IdleTimeout         = TimeSpan.FromHours(8);
});

var app = builder.Build();
app.UseCors();
app.UseSession();

// ── Data paths ─────────────────────────────────────────────────
var dataDir = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "data");
if (!Directory.Exists(dataDir))
    dataDir = Path.Combine(Directory.GetCurrentDirectory(), "data");
var productsPath   = Path.Combine(dataDir, "products.json");
var categoriesPath = Path.Combine(dataDir, "categories.json");
var adminPath      = Path.Combine(dataDir, "admin.json");

// ── Uploads directory ──────────────────────────────────────────
var uploadsRoot = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
Directory.CreateDirectory(uploadsRoot);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsRoot),
    RequestPath  = "/uploads"
});

// ── Load / save helpers ────────────────────────────────────────
T Load<T>(string path, T fallback)
{
    if (!File.Exists(path)) return fallback;
    try { return JsonSerializer.Deserialize<T>(File.ReadAllText(path), jsonOpts) ?? fallback; }
    catch { return fallback; }
}

void Save<T>(string path, T data)
    => File.WriteAllText(path, JsonSerializer.Serialize(data, jsonOpts));

// ── In-memory store ────────────────────────────────────────────
var products   = Load<List<Product>>(productsPath, []);
var categories = Load<List<Category>>(categoriesPath, []);
var adminUser  = Load<AdminUser>(adminPath, new AdminUser("admin", "", ""));

// Upgrade plain-text password to bcrypt hash on first start
if (!string.IsNullOrEmpty(adminUser.Password) && string.IsNullOrEmpty(adminUser.PasswordHash))
{
    var hash = BCrypt.Net.BCrypt.HashPassword(adminUser.Password);
    adminUser = adminUser with { PasswordHash = hash, Password = null };
    Save(adminPath, adminUser);
}

// ── Auth helpers ───────────────────────────────────────────────
bool IsAuth(HttpContext ctx)
{
    var login = ctx.Session.GetString("login");
    return !string.IsNullOrEmpty(login);
}

IResult Unauthorized401() =>
    Results.Json(new { error = "Unauthorized" }, statusCode: 401);

// ── ID generators ──────────────────────────────────────────────
int NextProductId()  => products.Count   == 0 ? 1 : products.Max(p => p.Id)  + 1;
int NextCategoryId() => categories.Count == 0 ? 1 : categories.Max(c => c.Id) + 1;

// ── Upload helper ──────────────────────────────────────────────
string[] allowedExts = [".jpg", ".jpeg", ".png", ".webp"];

async Task<IResult> SaveUpload(HttpContext ctx, string subDir)
{
    var file = ctx.Request.Form.Files.FirstOrDefault();
    if (file is null) return Results.BadRequest(new { error = "No file" });
    if (file.Length > 5 * 1024 * 1024) return Results.BadRequest(new { error = "File too large (max 5 MB)" });

    var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
    if (!allowedExts.Contains(ext)) return Results.BadRequest(new { error = "Invalid file type" });

    Directory.CreateDirectory(Path.Combine(uploadsRoot, subDir));
    var fileName = $"{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}{ext}";
    var filePath = Path.Combine(uploadsRoot, subDir, fileName);
    await using var stream = File.Create(filePath);
    await file.CopyToAsync(stream);
    return Results.Ok(new { url = $"/uploads/{subDir}/{fileName}" });
}

void DeleteUpload(string subDir, string filename)
{
    if (string.IsNullOrWhiteSpace(filename) || filename.Contains('/') || filename.Contains('\\'))
        return;
    var filePath = Path.Combine(uploadsRoot, subDir, filename);
    if (File.Exists(filePath)) File.Delete(filePath);
}

// ═══════════════════════════════════════════════════════════════
// HEALTH — unauthenticated
// ═══════════════════════════════════════════════════════════════
app.MapGet("/api/healthz", () => Results.Ok(new { status = "ok" }));

// ═══════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════

app.MapPost("/api/auth/login", async (HttpContext ctx) =>
{
    var body = await JsonSerializer.DeserializeAsync<LoginRequest>(ctx.Request.Body, jsonOpts);
    if (body is null) return Results.BadRequest(new { error = "Invalid body" });

    var loginMatch = string.Equals(body.Login, adminUser.Login, StringComparison.OrdinalIgnoreCase);
    var passMatch  = !string.IsNullOrEmpty(adminUser.PasswordHash)
        && BCrypt.Net.BCrypt.Verify(body.Password ?? "", adminUser.PasswordHash);

    if (!loginMatch || !passMatch)
        return Results.Json(new { error = "Невірний логін або пароль" }, statusCode: 401);

    await ctx.Session.LoadAsync();
    ctx.Session.SetString("login", adminUser.Login);
    return Results.Ok(new { ok = true, login = adminUser.Login });
});

app.MapPost("/api/auth/logout", async (HttpContext ctx) =>
{
    await ctx.Session.LoadAsync();
    if (!IsAuth(ctx)) return Unauthorized401();
    ctx.Session.Clear();
    return Results.Ok(new { ok = true });
});

app.MapGet("/api/auth/me", async (HttpContext ctx) =>
{
    await ctx.Session.LoadAsync();
    var login = ctx.Session.GetString("login");
    if (string.IsNullOrEmpty(login)) return Unauthorized401();
    return Results.Ok(new { login });
});

// ═══════════════════════════════════════════════════════════════
// PRODUCTS — all require auth
// ═══════════════════════════════════════════════════════════════
app.MapGet("/api/products", async (HttpContext ctx) =>
{
    await ctx.Session.LoadAsync();
    if (!IsAuth(ctx)) return Unauthorized401();
    return Results.Ok(products);
});

app.MapPost("/api/products", async (HttpContext ctx) =>
{
    await ctx.Session.LoadAsync();
    if (!IsAuth(ctx)) return Unauthorized401();

    var p = await JsonSerializer.DeserializeAsync<Product>(ctx.Request.Body, jsonOpts);
    if (p is null) return Results.BadRequest(new { error = "Invalid body" });
    p = p with { Id = NextProductId() };
    products.Add(p);
    Save(productsPath, products);
    return Results.Ok(p);
});

app.MapGet("/api/products/{id:int}", async (HttpContext ctx, int id) =>
{
    await ctx.Session.LoadAsync();
    if (!IsAuth(ctx)) return Unauthorized401();
    var p = products.FirstOrDefault(x => x.Id == id);
    return p is not null ? Results.Ok(p) : Results.NotFound();
});

app.MapPut("/api/products/{id:int}", async (HttpContext ctx, int id) =>
{
    await ctx.Session.LoadAsync();
    if (!IsAuth(ctx)) return Unauthorized401();

    var p = await JsonSerializer.DeserializeAsync<Product>(ctx.Request.Body, jsonOpts);
    if (p is null) return Results.BadRequest(new { error = "Invalid body" });
    p = p with { Id = id };
    var idx = products.FindIndex(x => x.Id == id);
    if (idx < 0) return Results.NotFound();
    products[idx] = p;
    Save(productsPath, products);
    return Results.Ok(p);
});

app.MapDelete("/api/products/{id:int}", async (HttpContext ctx, int id) =>
{
    await ctx.Session.LoadAsync();
    if (!IsAuth(ctx)) return Unauthorized401();

    var removed = products.RemoveAll(x => x.Id == id);
    if (removed == 0) return Results.NotFound();
    Save(productsPath, products);

    // Remove uploaded photos folder for this product
    var dir = Path.Combine(uploadsRoot, "products", id.ToString());
    if (Directory.Exists(dir)) Directory.Delete(dir, recursive: true);

    return Results.NoContent();
});

// ═══════════════════════════════════════════════════════════════
// UPLOAD — products
// ═══════════════════════════════════════════════════════════════
app.MapPost("/api/upload/products/{id:int}", async (HttpContext ctx, int id) =>
{
    await ctx.Session.LoadAsync();
    if (!IsAuth(ctx)) return Unauthorized401();
    return await SaveUpload(ctx, $"products/{id}");
});

app.MapDelete("/api/upload/products/{id:int}/{filename}", async (HttpContext ctx, int id, string filename) =>
{
    await ctx.Session.LoadAsync();
    if (!IsAuth(ctx)) return Unauthorized401();
    DeleteUpload($"products/{id}", filename);
    return Results.NoContent();
});

// ── List uploaded files for a product ─────────────────────────
app.MapGet("/api/upload/products/{id:int}", async (HttpContext ctx, int id) =>
{
    await ctx.Session.LoadAsync();
    if (!IsAuth(ctx)) return Unauthorized401();
    var dir = Path.Combine(uploadsRoot, "products", id.ToString());
    if (!Directory.Exists(dir)) return Results.Ok(Array.Empty<string>());
    var files = Directory.GetFiles(dir)
        .OrderBy(f => f)
        .Select(f => $"/uploads/products/{id}/{Path.GetFileName(f)}")
        .ToArray();
    return Results.Ok(files);
});

// ═══════════════════════════════════════════════════════════════
// CATEGORIES — all require auth
// ═══════════════════════════════════════════════════════════════
app.MapGet("/api/categories", async (HttpContext ctx) =>
{
    await ctx.Session.LoadAsync();
    if (!IsAuth(ctx)) return Unauthorized401();
    return Results.Ok(categories);
});

app.MapPost("/api/categories", async (HttpContext ctx) =>
{
    await ctx.Session.LoadAsync();
    if (!IsAuth(ctx)) return Unauthorized401();

    var c = await JsonSerializer.DeserializeAsync<Category>(ctx.Request.Body, jsonOpts);
    if (c is null) return Results.BadRequest(new { error = "Invalid body" });
    c = c with { Id = NextCategoryId() };
    categories.Add(c);
    Save(categoriesPath, categories);
    return Results.Ok(c);
});

app.MapGet("/api/categories/{id:int}", async (HttpContext ctx, int id) =>
{
    await ctx.Session.LoadAsync();
    if (!IsAuth(ctx)) return Unauthorized401();
    var c = categories.FirstOrDefault(x => x.Id == id);
    return c is not null ? Results.Ok(c) : Results.NotFound();
});

app.MapPut("/api/categories/{id:int}", async (HttpContext ctx, int id) =>
{
    await ctx.Session.LoadAsync();
    if (!IsAuth(ctx)) return Unauthorized401();

    var c = await JsonSerializer.DeserializeAsync<Category>(ctx.Request.Body, jsonOpts);
    if (c is null) return Results.BadRequest(new { error = "Invalid body" });
    c = c with { Id = id };
    var idx = categories.FindIndex(x => x.Id == id);
    if (idx < 0) return Results.NotFound();
    categories[idx] = c;
    Save(categoriesPath, categories);
    return Results.Ok(c);
});

app.MapDelete("/api/categories/{id:int}", async (HttpContext ctx, int id) =>
{
    await ctx.Session.LoadAsync();
    if (!IsAuth(ctx)) return Unauthorized401();

    var removed = categories.RemoveAll(x => x.Id == id);
    if (removed == 0) return Results.NotFound();
    Save(categoriesPath, categories);

    var dir = Path.Combine(uploadsRoot, "categories", id.ToString());
    if (Directory.Exists(dir)) Directory.Delete(dir, recursive: true);

    return Results.NoContent();
});

// ═══════════════════════════════════════════════════════════════
// UPLOAD — categories
// ═══════════════════════════════════════════════════════════════
app.MapPost("/api/upload/categories/{id:int}", async (HttpContext ctx, int id) =>
{
    await ctx.Session.LoadAsync();
    if (!IsAuth(ctx)) return Unauthorized401();

    // Remove old photo for this category (only one photo allowed)
    var dir = Path.Combine(uploadsRoot, "categories", id.ToString());
    if (Directory.Exists(dir))
        foreach (var f in Directory.GetFiles(dir)) File.Delete(f);

    return await SaveUpload(ctx, $"categories/{id}");
});

app.MapDelete("/api/upload/categories/{id:int}/{filename}", async (HttpContext ctx, int id, string filename) =>
{
    await ctx.Session.LoadAsync();
    if (!IsAuth(ctx)) return Unauthorized401();
    DeleteUpload($"categories/{id}", filename);
    return Results.NoContent();
});

// ═══════════════════════════════════════════════════════════════
// UPLOAD — slider (banners)
// ═══════════════════════════════════════════════════════════════
app.MapPost("/api/upload/slider/{key}", async (HttpContext ctx, string key) =>
{
    await ctx.Session.LoadAsync();
    if (!IsAuth(ctx)) return Unauthorized401();

    // Validate key (no path traversal)
    if (string.IsNullOrWhiteSpace(key) || key.Contains('/') || key.Contains('\\'))
        return Results.BadRequest(new { error = "Invalid key" });

    var file = ctx.Request.Form.Files.FirstOrDefault();
    if (file is null) return Results.BadRequest(new { error = "No file" });
    if (file.Length > 5 * 1024 * 1024) return Results.BadRequest(new { error = "File too large (max 5 MB)" });

    var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
    if (!allowedExts.Contains(ext)) return Results.BadRequest(new { error = "Invalid file type" });

    var sliderDir = Path.Combine(uploadsRoot, "slider");
    Directory.CreateDirectory(sliderDir);

    // Replace any existing file with same key (any extension)
    foreach (var old in Directory.GetFiles(sliderDir, $"{key}.*")) File.Delete(old);

    var fileName = $"{key}{ext}";
    var filePath = Path.Combine(sliderDir, fileName);
    await using var stream = File.Create(filePath);
    await file.CopyToAsync(stream);
    return Results.Ok(new { url = $"/uploads/slider/{fileName}" });
});

app.MapDelete("/api/upload/slider/{key}", async (HttpContext ctx, string key) =>
{
    await ctx.Session.LoadAsync();
    if (!IsAuth(ctx)) return Unauthorized401();
    if (string.IsNullOrWhiteSpace(key) || key.Contains('/') || key.Contains('\\'))
        return Results.BadRequest(new { error = "Invalid key" });
    var sliderDir = Path.Combine(uploadsRoot, "slider");
    foreach (var f in Directory.GetFiles(sliderDir, $"{key}.*")) File.Delete(f);
    return Results.NoContent();
});

// List all slider uploads
app.MapGet("/api/upload/slider", async (HttpContext ctx) =>
{
    await ctx.Session.LoadAsync();
    if (!IsAuth(ctx)) return Unauthorized401();
    var sliderDir = Path.Combine(uploadsRoot, "slider");
    if (!Directory.Exists(sliderDir)) return Results.Ok(new Dictionary<string, string>());
    var map = Directory.GetFiles(sliderDir)
        .ToDictionary(
            f => Path.GetFileNameWithoutExtension(f),
            f => $"/uploads/slider/{Path.GetFileName(f)}"
        );
    return Results.Ok(map);
});

// ═══════════════════════════════════════════════════════════════
// ORDERS (stub — all require auth)
// ═══════════════════════════════════════════════════════════════
var orders = new List<Order>();

app.MapGet("/api/orders", async (HttpContext ctx) =>
{
    await ctx.Session.LoadAsync();
    if (!IsAuth(ctx)) return Unauthorized401();
    return Results.Ok(orders);
});

app.MapPatch("/api/orders/{id:int}/status", async (HttpContext ctx, int id) =>
{
    await ctx.Session.LoadAsync();
    if (!IsAuth(ctx)) return Unauthorized401();

    var body = await JsonSerializer.DeserializeAsync<StatusPatch>(ctx.Request.Body, jsonOpts);
    var o = orders.FirstOrDefault(x => x.Id == id);
    if (o is null) return Results.NotFound();
    var idx = orders.IndexOf(o);
    orders[idx] = o with { Status = body?.Status ?? o.Status };
    return Results.Ok(orders[idx]);
});

app.Run();

// ═══════════════════════════════════════════════════════════════
// MODELS
// ═══════════════════════════════════════════════════════════════
record ProductSize(string Size, int Stock);

record Product(
    int      Id,
    string   Name,
    decimal  Price,
    decimal? SalePrice,
    string?  Description,
    int?     CategoryId,
    bool     Active,
    bool     IsNew,
    bool     IsTop,
    List<string>?      Photos,
    string?  ColorName,
    string?  ColorHex,
    List<ProductSize>? Sizes
);

record Category(int Id, string Name, string? Slug, string? Photo, bool? Active, int? Count);

record AdminUser(string Login, string? PasswordHash, string? Password);

record Order(int Id, string Status, DateTime CreatedAt);

record LoginRequest(string? Login, string? Password);

record StatusPatch(string? Status);
