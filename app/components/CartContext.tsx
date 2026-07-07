"use client";

import { createContext, useContext, useState } from "react";

// Haelt die Warenkorb-Gesamtmenge clientseitig, damit der Zaehler im Header
// sofort ohne Reload aktualisiert. Startwert kommt serverseitig aus dem Cookie.

type CartCtx = { count: number; setCount: (n: number) => void };
const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({
  initialCount,
  children,
}: {
  initialCount: number;
  children: React.ReactNode;
}) {
  const [count, setCount] = useState(initialCount);
  return <Ctx.Provider value={{ count, setCount }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart muss innerhalb von CartProvider verwendet werden.");
  return ctx;
}
