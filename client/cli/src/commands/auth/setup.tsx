import { runAuthSetup } from "../../auth/setup";
import { registerCommand } from "../../command";
import { Output } from "../../ui";
export const setupCommand = registerCommand({
  path: "auth setup",
  description: "Configure OIDC client settings",
  implemented: true,
  View: Output,
  run: async ({ args }) => runAuthSetup(args),
});
