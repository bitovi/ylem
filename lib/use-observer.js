import { useEffect, useState, useRef } from 'react';
import Observer from './can-observer';

export default function useObserver() {
  const [, update] = useState();

  const observer = useRef(new Observer(() => update({})));

  observer.current.startRecording();
  useEffect(() => {
    observer.current.stopRecording();
  });

  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    return () => {
      observer.current.teardown();
      observer.current = null;
    };
  }, []);
}
