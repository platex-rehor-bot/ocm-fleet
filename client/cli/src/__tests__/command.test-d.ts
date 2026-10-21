import type { ComponentType } from "react";

import { parseArgs } from "../argv";
import { registerCommand } from "../command";
import type { CommandEntry, CommandSpec } from "../commands/types";

declare const View: ComponentType<{ data: { name: string } }>;

registerCommand({
  path: "example",
  description: "Example",
  implemented: true,
  run: async () => ({ name: "ready" }),
  View,
});

registerCommand({
  path: "example",
  description: "Example",
  implemented: true,
  run: async () => ({ count: 1 }),
  // @ts-expect-error The view must accept the runner's data.
  View,
});

registerCommand<{ name: string }>({
  path: "example",
  description: "Example",
  implemented: true,
  run: async () => ({ name: "ready" }),
  // @ts-expect-error The text formatter must accept the runner's data.
  formatText: (data: { count: number }) => String(data.count),
});

// @ts-expect-error A command cannot declare both a view and an exact-text formatter.
registerCommand({
  path: "example",
  description: "Example",
  implemented: true,
  run: async () => ({ name: "ready" }),
  View,
  formatText: (data: { name: string }) => data.name,
});

const spec: CommandSpec<{ name: string }> = {
  path: "example",
  description: "Example",
  implemented: true,
  run: async () => ({ name: "ready" }),
  View,
};

const registered = registerCommand(spec);

// @ts-expect-error Registry consumers must access the typed spec through withSpec.
void registered.run;

registered.withSpec(async (spec) => {
  const data = await spec.run({ args: parseArgs([]) });
  // @ts-expect-error A registry consumer cannot assume a particular data type.
  void data.name;
});

const invalidSpec: CommandSpec<{ name: string }> = {
  path: "example",
  description: "Example",
  implemented: true,
  // @ts-expect-error The spec itself checks the data returned by run.
  run: async () => ({ count: 1 }),
  View,
};
void invalidSpec;

// @ts-expect-error An implemented registry entry must provide access to a typed spec.
const incompleteEntry: CommandEntry = {
  path: "example",
  description: "Example",
  implemented: true,
};
void incompleteEntry;
