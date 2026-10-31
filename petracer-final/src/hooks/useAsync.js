import { useEffect, useState } from "react";

export function useAsync(asyncFn, deps) {
  const [reloadCount, setReloadCount] = useState(0);
  const [result, setResult] = useState({
    key: null,
    data: undefined,
    error: null,
  });
  const key = JSON.stringify([...deps, reloadCount]);

  useEffect(() => {
    let ignore = false;
    asyncFn().then(
      (data) => {
        if (!ignore) setResult({ key, data, error: null });
      },
      (error) => {
        if (!ignore) setResult({ key, data: undefined, error });
      },
    );
    return () => {
      ignore = true;
    };
    // Zależności przekazuje wywołujący w `deps` (zakodowane w `key`), a `asyncFn` bywa
    // tworzona na nowo przy każdym renderze — dodanie jej tutaj powodowałoby pętlę zapytań.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const isCurrent = result.key === key;
  return {
    data: isCurrent ? result.data : undefined,
    error: isCurrent ? result.error : null,
    isLoading: !isCurrent,
    reload: () => setReloadCount((count) => count + 1),
  };
}
