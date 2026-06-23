(function exposeSupabaseGlobal() {
  if (window.supabase?.createClient) {
    return;
  }

  try {
    if (typeof supabase !== "undefined" && supabase?.createClient) {
      window.supabase = supabase;
    }
  } catch {
    // Supabase is optional for local development; interpreter.js will use WebSocket fallback.
  }
})();
