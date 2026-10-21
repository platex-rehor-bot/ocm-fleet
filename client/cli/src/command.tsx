import type { CommandContext, CommandDefinition } from "./commands/types";

/** Capture each runner's data and presenter before storing different commands together. */
export function defineCommand<Data>({
  run,
  View,
  formatText,
  ...spec
}: CommandDefinition<Data>) {
  return {
    ...spec,
    async run(context: CommandContext) {
      const data = await run(context);
      const renderHuman = View
        ? () => <View data={data} />
        : formatText
          ? () => formatText(data)
          : undefined;
      return { data, renderHuman };
    },
  };
}
