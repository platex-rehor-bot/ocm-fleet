import type { Writable } from "node:stream";

import { render } from "ink";
import type { ReactElement, ReactNode } from "react";

import type { OutputFormat } from "./argv";
import type { CommandResult } from "./commands/types";

export function formatOutput(
  result: CommandResult,
  output: OutputFormat,
): ReactElement | string {
  if (output === "table" && result.renderHuman) return result.renderHuman();
  return JSON.stringify(result.data, null, 2) ?? "null";
}

/** Write exact text without terminal wrapping that would split identifiers. */
export async function writeText(
  value: string,
  stdout: Writable = process.stdout,
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    stdout.once("error", reject);
    stdout.write(`${value}\n`, (error) => {
      if (error) {
        // A failed write also emits "error"; leave the listener to consume it.
        reject(error);
      } else {
        stdout.off("error", reject);
        resolve();
      }
    });
  });
}

export async function print(
  result: CommandResult,
  output: OutputFormat = "table",
): Promise<void> {
  const content = formatOutput(result, output);
  if (typeof content === "string") await writeText(content);
  else await printView(content);
}

export async function printView(element: ReactNode): Promise<void> {
  const instance = render(element);
  try {
    await instance.waitUntilExit();
  } finally {
    instance.unmount();
  }
}
