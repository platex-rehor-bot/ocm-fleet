import { runAuthLogin } from "../../auth/login";
import { defineCommand } from "../../command";
import { Output } from "../../ui";

export const loginCommand = defineCommand({
  path: "auth login",
  description: "Authenticate with configured OIDC provider",
  implemented: true,
  View: Output,
  run: async ({ args }) => runAuthLogin(args),
});
