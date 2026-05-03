import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, locals, redirect }) => {
  const code = url.searchParams.get('code');
  const isPopup = url.searchParams.get('popup') === '1';
  const next = url.searchParams.get('next') ?? '/';

  if (code) {
    const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return redirect(`/login?err=${encodeURIComponent(error.message)}`);
    }
  }

  if (isPopup) {
    return new Response(
      `<!doctype html><html><body><script>window.opener?.postMessage('auth-complete','*');window.close();</script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } },
    );
  }

  return redirect(next);
};
