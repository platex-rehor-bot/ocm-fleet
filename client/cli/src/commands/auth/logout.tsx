import { flagString } from "../../argv";
import { defineCommand } from "../../command";
import { clearStoredTokens } from "../../config";
import { Output } from "../../ui";

export const logoutCommand = defineCommand({
  path: "auth logout",
  description: "Clear stored authentication tokens",
  implemented: true,
  View: Output,
  run: async ({ args }) => {
    await clearStoredTokens(flagString(args, "config-dir") || undefined);
    return "Logged out.";
  },
});
