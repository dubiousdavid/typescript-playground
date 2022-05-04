import React from 'react';

type FetchHookState =
  | { status: 'loading' }
  | { status: 'loaded'; data: any }
  | { status: 'error'; error: any };

export const useFetch = (url: RequestInfo, init?: RequestInit) => {
  const [result, setResult] = React.useState<FetchHookState>({
    status: 'loading',
  });

  React.useEffect(() => {
    console.debug('Fetching %s', url);
    fetch(url, init)
      .then((response) => response.json())
      .then((response) => setResult({ status: 'loaded', data: response }))
      .catch((error) => setResult({ status: 'error', error }));
  }, [url, init]);

  return result;
};
