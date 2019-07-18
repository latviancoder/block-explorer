import { useEffect, useRef } from 'react';

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

const rtf1 = new Intl.RelativeTimeFormat('en', { style: 'narrow' });

export function formatSecondsAgo(date1, date2) {
  const secondsAgo = (date1.getTime() - date2.getTime()) / 1000;
  return rtf1.format(-Math.ceil(secondsAgo), 'seconds');
}