import { useEffect } from 'react';

/** Sets the browser tab title, prefixed with the app name. */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · Big Face`;
    return () => {
      document.title = 'Big Face';
    };
  }, [title]);
}
