import { useDebouncedValue } from "./useDebouncedValue";
import { expect, test } from "vitest";
import { renderHook } from "@testing-library/react";

describe("useDebouncedValue", () => {
  test("should return the initial value", () => {
    const value = "test";
    const delay = 1000;
    const result = renderHook(() => useDebouncedValue(value, delay));

    expect(result.result.current).toBe(value);
  });
});
