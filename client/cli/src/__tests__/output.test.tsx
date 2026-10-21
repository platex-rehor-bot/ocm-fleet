/* eslint-disable playwright/no-standalone-expect */
import { PassThrough, Writable } from "node:stream";

import { Text } from "ink";
import { cleanup, render } from "ink-testing-library";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { formatOutput, writeText } from "../app";
import { parseArgs } from "../argv";
import { defineCommand } from "../command";

afterEach(cleanup);

const context = { args: parseArgs([]) };

describe("command output", () => {
  it("serializes original data without evaluating the human presenter", async () => {
    const data = { identifier: "a".repeat(200), enabled: false };
    const command = defineCommand({
      path: "example",
      description: "Example",
      implemented: true,
      run: async () => data,
      View() {
        throw new Error("JSON must bypass React");
      },
    });

    expect(formatOutput(await command.run(context), "json")).toBe(
      JSON.stringify(data, null, 2),
    );
  });

  it("passes returned data to a React component that can use hooks", async () => {
    function View({ data }: { data: { name: string } }) {
      const [name] = useState(data.name);
      return <Text>{name}</Text>;
    }
    const command = defineCommand({
      path: "example",
      description: "Example",
      implemented: true,
      run: async () => ({ name: "fleetctl ready" }),
      View,
    });

    const content = formatOutput(await command.run(context), "table");
    if (typeof content === "string") throw new Error("Expected a React view");
    const view = render(content);
    expect(view.lastFrame()).toBe("fleetctl ready");
  });

  it("uses JSON as the default presentation when a command has no human view", async () => {
    const command = defineCommand({
      path: "example",
      description: "Example",
      implemented: true,
      run: async () => ({ names: ["one", "two"] }),
    });
    const result = await command.run(context);

    expect(formatOutput(result, "table")).toBe(formatOutput(result, "json"));
  });

  it("keeps exact text separate from JSON serialization", async () => {
    const command = defineCommand({
      path: "example",
      description: "Example",
      implemented: true,
      run: async () => ["ocm.kind.v1alpha/clusters"],
      formatText: (data) => ["TYPE", ...data].join("\n"),
    });
    const result = await command.run(context);

    expect(formatOutput(result, "table")).toBe(
      "TYPE\nocm.kind.v1alpha/clusters",
    );
    expect(formatOutput(result, "json")).toBe(
      '[\n  "ocm.kind.v1alpha/clusters"\n]',
    );
  });

  it("does not evaluate an exact-text formatter for JSON output", async () => {
    const command = defineCommand({
      path: "example",
      description: "Example",
      implemented: true,
      run: async () => ["ocm.kind.v1alpha/clusters"],
      formatText() {
        throw new Error("JSON must bypass human text formatting");
      },
    });

    expect(formatOutput(await command.run(context), "json")).toBe(
      '[\n  "ocm.kind.v1alpha/clusters"\n]',
    );
  });

  it.each([null, undefined])(
    "serializes an absent result as null (%s)",
    async (data) => {
      const command = defineCommand({
        path: "example",
        description: "Example",
        implemented: true,
        run: async () => data,
      });

      expect(formatOutput(await command.run(context), "json")).toBe("null");
    },
  );
});

describe("text output", () => {
  it("preserves complete schema identifiers and appends exactly one newline", async () => {
    const stdout = new PassThrough();
    const chunks: Buffer[] = [];
    stdout.on("data", (chunk: Buffer) => chunks.push(chunk));
    const value = [
      "TYPE\tSINGULAR\tSERVICE",
      "ocm.kind.v1alpha/clusters\tCluster\tocm.kind.v1alpha.ClusterService",
    ].join("\n");

    await writeText(value, stdout);

    expect(Buffer.concat(chunks).toString()).toBe(`${value}\n`);
    expect(stdout.writableEnded).toBe(false);
    stdout.destroy();
  });

  it("waits for the stream to finish writing", async () => {
    let start!: () => void;
    let finish!: () => void;
    const started = new Promise<void>((resolve) => {
      start = resolve;
    });
    const finished = new Promise<void>((resolve) => {
      finish = resolve;
    });
    const stdout = new Writable({
      write(_chunk, _encoding, callback) {
        start();
        void finished.then(() => callback());
      },
    });
    let completed = false;
    const writing = writeText("ready", stdout).then(() => {
      completed = true;
    });
    await started;
    expect(completed).toBe(false);

    finish();
    await writing;
    expect(completed).toBe(true);
    stdout.destroy();
  });

  it("propagates stream errors without leaving an unhandled error event", async () => {
    const failure = new Error("output failed");
    const stdout = new Writable({
      write(_chunk, _encoding, callback) {
        callback(failure);
      },
    });

    await expect(writeText("ready", stdout)).rejects.toBe(failure);
  });
});
