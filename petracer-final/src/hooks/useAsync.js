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
  }, [key]);
  const isCurrent = result.key === key;
  return {
    data: isCurrent ? result.data : undefined,
    error: isCurrent ? result.error : null,
    isLoading: !isCurrent,
    reload: () => setReloadCount((count) => count + 1),
  };
}
