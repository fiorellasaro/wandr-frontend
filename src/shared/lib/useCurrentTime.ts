import { useEffect, useState } from "react";

export function useCurrentTime(refreshMs = 30000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, refreshMs);

    return () => window.clearInterval(intervalId);
  }, [refreshMs]);

  return now;
}
