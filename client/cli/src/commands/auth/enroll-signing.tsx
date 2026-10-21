import { runAuthEnrollSigning } from "../../auth/enroll-signing";
import { registerCommand } from "../../command";
import { Output } from "../../ui";

export const enrollSigningCommand = registerCommand({
  path: "auth enroll-signing",
  description: "Generate and enroll signing key pair",
  implemented: true,
  View: Output,
  run: async ({ args }) => runAuthEnrollSigning(args),
});
