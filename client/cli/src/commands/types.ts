import type { ComponentType } from "react";

import type { ParsedArgs } from "../argv";

export interface CommandContext {
  args: ParsedArgs;
}

export type CommandRunner<Data> = (context: CommandContext) => Promise<Data>;

interface CommandMetadata {
  path: string;
  aliases?: string[];
  description: string;
}

export type CommandSpec<Data> = CommandMetadata & {
  implemented: true;
  run: CommandRunner<Data>;
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

export interface RegisteredCommand extends CommandMetadata {
  implemented: true;
  /** Access the complete spec while preserving its shared data type. */
  withSpec<Result>(visit: <Data>(spec: CommandSpec<Data>) => Result): Result;
}

export type CommandEntry =
  RegisteredCommand | (CommandMetadata & { implemented?: false });
