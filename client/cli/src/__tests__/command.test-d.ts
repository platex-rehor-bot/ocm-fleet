import type { ComponentType } from "react";

import { defineCommand } from "../command";

declare const View: ComponentType<{ data: { name: string } }>;

defineCommand({
  path: "example",
  description: "Example",
  implemented: true,
  run: async () => ({ name: "ready" }),
  View,
});

defineCommand({
  path: "example",
  description: "Example",
  implemented: true,
  run: async () => ({ count: 1 }),
  // @ts-expect-error The view must accept the runner's data.
  View,
});

defineCommand<{ name: string }>({
  path: "example",
  description: "Example",
  implemented: true,
  run: async () => ({ name: "ready" }),
  // @ts-expect-error The text formatter must accept the runner's data.
  formatText: (data: { count: number }) => String(data.count),
});

// @ts-expect-error A command cannot declare both a view and an exact-text formatter.
defineCommand({
  path: "example",
  description: "Example",
  implemented: true,
  run: async () => ({ name: "ready" }),
  View,
  formatText: (data: { name: string }) => data.name,
});
