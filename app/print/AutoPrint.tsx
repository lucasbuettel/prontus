"use client";

import { useEffect } from "react";

export function AutoPrint() {
  useEffect(() => {
    const id = window.setTimeout(() => window.print(), 200);
    return () => window.clearTimeout(id);
  }, []);

  return null;
}
