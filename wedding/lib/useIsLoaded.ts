"use client";

import { useState, useEffect } from "react";

// LoadingScreen скрывается на 3200ms, curtain exit 1100ms → hero виден ~3300ms
const LOADED_AT_MS = 3300;

export function useIsLoaded() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), LOADED_AT_MS);
    return () => clearTimeout(t);
  }, []);
  return loaded;
}
