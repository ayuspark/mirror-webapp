import React from 'react';
import { parse } from 'query-string';

function decodeParam(val) {
  if (!(typeof val === 'string' || val.length === 0)) {
    return val;
  }

  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = `Failed to decode param '${val}'`;
      err.status = 400;
    }

    throw err;
  }
}

// Match the provided URL path pattern to an actual URI string. For example:
//   matchURI({ path: '/posts/:id' }, '/dummy') => null
//   matchURI({ path: '/posts/:id' }, '/posts/123') => { id: 123 }
function matchURI(route, path) {
  const match = route.pattern.exec(path);

  if (!match) {
    return null;
  }

  const params = Object.create(null);

  for (let i = 1; i < match.length; i += 1) {
    params[route.keys[i - 1].name] = match[i] !== undefined ? decodeParam(match[i]) : undefined;
  }

  return params;
}

// Find the route matching the specified location (context), fetch the required data,
// instantiate and return a React component
function resolve(routes, context) {
  // TODO: Iterator syntax to replace loop (remove eslint disable on next line to see error)
  for (const route of routes) { // eslint-disable-line
    const params = matchURI(route, context.error ? '/error' : context.pathname);
    const query = parse(context.search);

    if (params) {
      // Check if the route has any data requirements, for example:
      // { path: '/tasks/:id', data: { task: 'GET /api/tasks/$id' }, page: './pages/task' }
      if (route.data) {
        // Load page component and all required data in parallel
        const keys = Object.keys(route.data);
        return Promise.all([
          route.load(),
          ...keys.map((key) => {
            const request = route.data[key];
            const method = request.substring(0, request.indexOf(' '));
            let url = request.substr(request.indexOf(' ') + 1); // /api/tasks/$id
            // TODO: Replace query parameters with actual values coming from `params`
            Object.keys(query).forEach((k) => {
              url = url.replace(`${k}`, query[k]);
            });
            return fetch(url, { method }).then(resp => resp.json());
          }),
        ]).then(([Page, ...data]) => {
          const props = keys.reduce((result, key, i) => ({ ...result, [key]: data[i] }), {});
          return <Page route={{ ...route, params }} error={context.error} {...props} />;
        });
      }

      return route.load().then(Page =>
        <Page route={{ ...route, params, query }} error={context.error} />);
    }
  }

  const error = new Error('Page not found');
  error.status = 404;
  return Promise.reject(error);
}

export default { resolve };
