import { runAuthEnrollSigning } from "../../auth/enroll-signing";
import { defineCommand } from "../../command";
import { Output } from "../../ui";

export const enrollSigningCommand = defineCommand({
  path: "auth enroll-signing",
  description: "Generate and enroll signing key pair",
  implemented: true,
  View: Output,
  run: async ({ args }) => runAuthEnrollSigning(args),
});
