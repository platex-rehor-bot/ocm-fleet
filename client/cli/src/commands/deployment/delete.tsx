import { registerCommand } from "../../command";
import { Output } from "../../ui";
import { deploymentClient, deploymentName } from "./helpers";

export const deleteCommand = registerCommand({
  path: "deployment delete",
  description: "Delete a deployment",
  implemented: true,
  View: Output,
  run: async ({ args }) => {
    const name = args.positionals[0];
    if (!name) throw new Error("deployment name is required");
    await (
      await deploymentClient(args)
    ).request(`/v1alpha/${deploymentName(name)}`, { method: "DELETE" });
    return "Deleted.";
  },
});
