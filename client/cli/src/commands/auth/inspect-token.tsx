import { formatTokenInspection, inspectStoredTokens } from "../../auth/inspect";
import { defineCommand } from "../../command";
import { Output } from "../../ui";

export const inspectTokenCommand = defineCommand({
  path: "auth inspect-token",
  description: "Decode and display stored authentication tokens",
  implemented: true,
  run: async ({ args }) => inspectStoredTokens(args),
  View: TokenInspectionView,
});

function TokenInspectionView({
  data,
}: {
  data: Awaited<ReturnType<typeof inspectStoredTokens>>;
}) {
  return <Output data={formatTokenInspection(data)} />;
}
