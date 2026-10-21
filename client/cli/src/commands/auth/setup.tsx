import { runAuthSetup } from "../../auth/setup";
import { Output } from "../../ui";
import type { CommandSpec } from "../types";
export const setupCommand = {
  path: "auth setup",
  description: "Configure OIDC client settings",
  implemented: true,
  View: Output,
  run: async ({ args }) => runAuthSetup(args),
} satisfies CommandSpec<string>;
