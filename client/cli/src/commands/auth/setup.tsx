import { runAuthSetup } from "../../auth/setup";
import { defineCommand } from "../../command";
import { Output } from "../../ui";
export const setupCommand = defineCommand({
  path: "auth setup",
  description: "Configure OIDC client settings",
  implemented: true,
  View: Output,
  run: async ({ args }) => runAuthSetup(args),
});
