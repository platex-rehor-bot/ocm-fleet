import type { ComponentType, ReactElement } from "react";

import type { ParsedArgs } from "../argv";

export interface CommandContext {
  args: ParsedArgs;
}

export interface CommandResult {
  data: unknown;
  renderHuman?: () => ReactElement | string;
}

export type CommandRunner = (context: CommandContext) => Promise<CommandResult>;

export interface CommandSpec {
  path: string;
  aliases?: string[];
  description: string;
  implemented?: boolean;
  run?: CommandRunner;
}

export type CommandDefinition<Data> = Omit<CommandSpec, "run"> & {
  implemented: true;
  run: (context: CommandContext) => Promise<Data>;
} & (
    | {
        View: ComponentType<{ data: Data }>;
        formatText?: never;
      }
    | {
        View?: never;
        formatText: (data: Data) => string;
      }
    | { View?: never; formatText?: never }
  );
