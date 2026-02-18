import { useState, useRef, useCallback, useEffect } from "react";

const RETRY_DELAYS = [1000, 2000, 4000];
const TIMEOUT_MS = 10000;
const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

export default function useApi() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const execute = useCallback(async (action, payload = {}) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setData(null);

    let lastError;

    for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
      if (controller.signal.aborted) return;

      try {
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({ action, ...payload }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          if (res.status >= 400 && res.status < 500) {
            const result = await res
              .json()
              .catch(() => ({ error: res.statusText }));
            throw {
              clientError: true,
              message: result.error || res.statusText,
            };
          }
          throw new Error(`Server error: ${res.status}`);
        }

        const result = await res.json();
        if (controller.signal.aborted) return;

        setData(result);
        setLoading(false);
        return result;
      } catch (err) {
        if (err.name === "AbortError") return;
        if (err.clientError) {
          setError(err.message);
          setLoading(false);
          return;
        }

        lastError = err;
        if (attempt < RETRY_DELAYS.length) {
          await new Promise((r) => setTimeout(r, RETRY_DELAYS[attempt]));
        }
      }
    }

    if (!controller.signal.aborted) {
      setError(lastError?.message || "Something went wrong");
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
}
