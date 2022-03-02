import { useEffect } from 'react';

export default function ({ children, title } = {}) {
  useEffect(
    function () {
      if (title !== document.title) {
        document.title = title || '';
      }
    },
    [title]
  );
  return children || '';
}
