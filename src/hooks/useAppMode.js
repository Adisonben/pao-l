"use client";

import { useMemo } from "react";
import { getAppMode } from "@/config/appMode";

export function useAppMode() {
  return useMemo(() => getAppMode(), []);
}
