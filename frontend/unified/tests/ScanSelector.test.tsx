import React from "react";
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ScanSelector } from "../src/components/ScanSelector";

const SCAN_IDS: number[] = [];
const setScanIds = (_: number[]) => console.log("Setting scan IDs");

test("single-scan selector is the default for scan selector component", async () => {
  render(<ScanSelector scanIds={SCAN_IDS} setScanIds={setScanIds} />);
  expect(screen.queryByText("Manual")).toBeNull();
  expect(screen.queryByText("Range")).toBeNull();
  expect(screen.getByText("Single")).toBeDefined();
});

test("click multiple toggle button renders multi-scan selector", async () => {
  render(<ScanSelector scanIds={SCAN_IDS} setScanIds={setScanIds} />);
  await userEvent.click(screen.getByTestId("multiple-scan-toggle"));
  expect(screen.getByText("Manual")).toBeDefined();
});
