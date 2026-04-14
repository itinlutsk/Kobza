using System.Text.Json;
using System.Text.Json.Serialization;
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

// ── CORS (allow all origins + credentials) ────────────────────
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.SetIsOriginAllowed(_ => true)
     .AllowAnyHeader()
     .AllowAnyMethod()
     .AllowCredentials()));

// ── Session (cookie-based, in-memory) ─────────────────────────
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(o =>
{
    o.Cookie.Name       = "skinz_session";
    o.Cookie.HttpOnly   = true;
    o.Cookie.SameSite   = SameSiteMode.None;
    o.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    o.IdleTimeout       = TimeSpan.FromHours(8);
});

var app = builder.Build();
app.UseCors();
app.UseSession();

// ── Data paths ─────────────────────────────────────────────────
var dataDir      = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "data");
if (!Directory.Exists(dataDir))
    dataDir = Path.Combine(Directory.GetCurrentDirectory(), "data");
var productsPath   = Path.Combine(dataDir, "products.json");
var categoriesPath = Path.Combine(dataDir, "categories.json");
var adminPath      = Path.Combine(dataDir, "admin.json");

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

IResult RequireAuth(HttpContext ctx)
    => IsAuth(ctx) ? Results.Ok() : Results.Json(new { error = "Unauthorized" }, statusCode: 401);

// ── ID generators ──────────────────────────────────────────────
int NextProductId()   => products.Count   == 0 ? 1 : products.Max(p => p.Id)   + 1;
int NextCategoryId()  => categories.Count == 0 ? 1 : categories.Max(c => c.Id) + 1;

// ═══════════════════════════════════════════════════════════════
// HEALTH
// ═══════════════════════════════════════════════════════════════
app.MapGet("/healthz", () => Results.Ok(new { status = "ok" }));

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
    ctx.Session.Clear();
    return Results.Ok(new { ok = true });
});

app.MapGet("/api/auth/me", async (HttpContext ctx) =>
{
    await ctx.Session.LoadAsync();
    var login = ctx.Session.GetString("login");
    if (string.IsNullOrEmpty(login))
        return Results.Json(new { error = "Unauthorized" }, statusCode: 401);
    return Results.Ok(new { login });
});

// ═══════════════════════════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════════════════════════
app.MapGet("/api/products", async (HttpContext ctx) =>
{
    await ctx.Session.LoadAsync();
    var r = RequireAuth(ctx); if (r is not null && ((IStatusCodeHttpResult)r).StatusCode == 401) return r;
    return Results.Ok(products);
});

app.MapPost("/api/products", async (HttpContext ctx) =>
{
    await ctx.Session.LoadAsync();
    var r = RequireAuth(ctx); if (r is not null && ((IStatusCodeHttpResult)r).StatusCode == 401) return r;

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
    var r = RequireAuth(ctx); if (r is not null && ((IStatusCodeHttpResult)r).StatusCode == 401) return r;
    var p = products.FirstOrDefault(x => x.Id == id);
    return p is not null ? Results.Ok(p) : Results.NotFound();
});

app.MapPut("/api/products/{id:int}", async (HttpContext ctx, int id) =>
{
    await ctx.Session.LoadAsync();
    var r = RequireAuth(ctx); if (r is not null && ((IStatusCodeHttpResult)r).StatusCode == 401) return r;

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
    var r = RequireAuth(ctx); if (r is not null && ((IStatusCodeHttpResult)r).StatusCode == 401) return r;

    var removed = products.RemoveAll(x => x.Id == id);
    if (removed == 0) return Results.NotFound();
    Save(productsPath, products);
    return Results.NoContent();
});

// ═══════════════════════════════════════════════════════════════
// CATEGORIES
// ═══════════════════════════════════════════════════════════════
app.MapGet("/api/categories", async (HttpContext ctx) =>
{
    await ctx.Session.LoadAsync();
    var r = RequireAuth(ctx); if (r is not null && ((IStatusCodeHttpResult)r).StatusCode == 401) return r;
    return Results.Ok(categories);
});

app.MapPost("/api/categories", async (HttpContext ctx) =>
{
    await ctx.Session.LoadAsync();
    var r = RequireAuth(ctx); if (r is not null && ((IStatusCodeHttpResult)r).StatusCode == 401) return r;

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
    var r = RequireAuth(ctx); if (r is not null && ((IStatusCodeHttpResult)r).StatusCode == 401) return r;
    var c = categories.FirstOrDefault(x => x.Id == id);
    return c is not null ? Results.Ok(c) : Results.NotFound();
});

app.MapPut("/api/categories/{id:int}", async (HttpContext ctx, int id) =>
{
    await ctx.Session.LoadAsync();
    var r = RequireAuth(ctx); if (r is not null && ((IStatusCodeHttpResult)r).StatusCode == 401) return r;

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
    var r = RequireAuth(ctx); if (r is not null && ((IStatusCodeHttpResult)r).StatusCode == 401) return r;

    var removed = categories.RemoveAll(x => x.Id == id);
    if (removed == 0) return Results.NotFound();
    Save(categoriesPath, categories);
    return Results.NoContent();
});

// ═══════════════════════════════════════════════════════════════
// ORDERS (stub — no persistence for now)
// ═══════════════════════════════════════════════════════════════
var orders = new List<Order>();

app.MapGet("/api/orders", async (HttpContext ctx) =>
{
    await ctx.Session.LoadAsync();
    var r = RequireAuth(ctx); if (r is not null && ((IStatusCodeHttpResult)r).StatusCode == 401) return r;
    return Results.Ok(orders);
});

app.MapPatch("/api/orders/{id:int}/status", async (HttpContext ctx, int id) =>
{
    await ctx.Session.LoadAsync();
    var r = RequireAuth(ctx); if (r is not null && ((IStatusCodeHttpResult)r).StatusCode == 401) return r;

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

record Category(int Id, string Name, string? Slug);

record AdminUser(string Login, string? PasswordHash, string? Password);

record Order(int Id, string Status, DateTime CreatedAt);

record LoginRequest(string? Login, string? Password);

record StatusPatch(string? Status);
