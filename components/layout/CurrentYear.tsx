"use client";

import { useEffect, useState } from "react";

export function CurrentYear() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  return year;
}