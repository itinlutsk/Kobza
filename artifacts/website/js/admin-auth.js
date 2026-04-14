/* Shared auth guard — include in every admin page.
   Redirects to login ONLY on HTTP 401 (API running, user not authenticated).
   If API is unreachable (network error) → no redirect, localStorage mode allowed. */
(async function checkAdminAuth() {
  const API_BASE = '/dotnet-api';
  try {
    const r = await fetch(API_BASE + '/api/auth/me', { credentials: 'include' });
    if (r.status === 401) {
      location.replace('admin-login.html');
    }
  } catch {
    /* API unavailable — allow localStorage-only mode */
  }
})();
