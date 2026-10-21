import type { CommandEntry } from "../types";
import { createCommand } from "./create";
import { deleteCommand } from "./delete";
import { getCommand } from "./get";
import { listCommand } from "./list";
import { resumeCommand } from "./resume";

export const deploymentCommand: CommandEntry = {
  path: "deployment",
  aliases: ["dep", "deployments"],
  description: "Manage deployments",
};

export const deploymentCommands: CommandEntry[] = [
  createCommand,
  getCommand,
  listCommand,
  resumeCommand,
  deleteCommand,
];
