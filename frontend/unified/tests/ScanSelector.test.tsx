import React from "react";
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ScanSelector } from "../src/components/ScanSelector";

test("single-scan selector is the default for scan selector component", async () => {
  render(<ScanSelector />);
  expect(screen.queryByText("Manual")).toBeNull();
  expect(screen.queryByText("Range")).toBeNull();
  expect(screen.getByText("Single")).toBeDefined();
});

test("click multiple toggle button renders multi-scan selector", async () => {
  render(<ScanSelector />);
  await userEvent.click(screen.getByTestId("multiple-scan-toggle"));
  expect(screen.getByText("Manual")).toBeDefined();
});
