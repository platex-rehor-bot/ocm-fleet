import { runAuthLogin } from "../../auth/login";
import { registerCommand } from "../../command";
import { Output } from "../../ui";

export const loginCommand = registerCommand({
  path: "auth login",
  description: "Authenticate with configured OIDC provider",
  implemented: true,
  View: Output,
  run: async ({ args }) => runAuthLogin(args),
});
