export function renderErrorPage(errorDetail?: unknown): string {
  const detailStr = errorDetail ? String(errorDetail).replace(/-->/g, '-- >') : '';
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #121415; color: #FFFFFF; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; background: #1a1d1f; border: 1px solid #2a2e32; border-radius: 0.375rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; color: #FFFFFF; }
      p { color: #F5F5F5; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #c9a55a; color: #121415; font-weight: 600; }
      .secondary { background: #1a1d1f; color: #FFFFFF; border-color: #2a2e32; }
    </style>
  </head>
  <body>
    <!-- SSR_DEBUG_START -->
    <!-- ${detailStr} -->
    <!-- SSR_DEBUG_END -->
    <div className="card" class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
