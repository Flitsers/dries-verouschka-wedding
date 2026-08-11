"use client";

import { useEffect } from "react";
import { startCountdown } from "@/components/sections/countdown-runtime";

type Props = {
  rootId: string;
  targetTimestamp: number;
};

export default function CountdownTicker({ rootId, targetTimestamp }: Props) {
  useEffect(() => {
    return startCountdown(document.getElementById(rootId), targetTimestamp);
  }, [rootId, targetTimestamp]);

  return null;
}
