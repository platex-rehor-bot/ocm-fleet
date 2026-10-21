import { registerCommand } from "../../command";
import { describeResourceType, listResourceTypes } from "../../grpc/reflection";

export const describeCommand = registerCommand({
  path: "resource describe",
  description: "Show managed resource schema",
  implemented: true,
  run: async ({ args }) => {
    const requested = args.positionals[0];
    if (!requested) throw new Error("resource type is required");
    const type = (await listResourceTypes(args)).find(
      (candidate) =>
        candidate.qualifiedName === requested ||
        candidate.collection === requested,
    );
    if (!type) throw new Error(`unknown resource type ${requested}`);
    const description = await describeResourceType(type, args);
    return { type, ...description };
  },
  formatText: ({ type, methods, specType, fields }) =>
    [
      `Type:     ${type.qualifiedName}`,
      `Singular: ${type.singular}`,
      `Service:  ${type.serviceName}`,
      "",
      "Methods:",
      ...methods.map((method) => `  ${method}`),
      "",
      `Spec (${specType}):`,
      ...fields.map((field) => `  ${field}`),
    ].join("\n"),
});
