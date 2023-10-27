/*
There is currently no way to get a `.astro` route to just return the HTML
without the CSS and JS. This is a workaround to remove the CSS and JS from
the HTML response of HTMX fragment routes.

The premise here is that HTMX fragments won't required additional styles because
the Tailwind for the entire experience is alreay precomputed. And second that it will
not require additional JS because ... HTMX.
*/
const HTMX_FRAGMENT_ROUTES = ["/prompt"];

export const onRequest = async (context, next) => {
  if (
    !HTMX_FRAGMENT_ROUTES.find((route) => context.request.url.includes(route))
  ) {
    return next();
  }

  const response = await next();
  console.log(context.url.pathname)
  let html = await response.text();

  // Delete the CSS and JS from the HTML response
  html = html.replace(/<style type\=\"text\/css\"(.*)<\/style>/s, "");
  html = html.replace(/<script(.*)<\/script>/gm, "");

  return new Response(html, {
    status: 200,
    headers: response.headers,
  });
};
