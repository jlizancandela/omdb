import { renderHook } from "@testing-library/react";
import { useIntersectionObserver } from "./useIntersectionObserver";
import { vi } from "vitest";

describe("useIntersectionObserver", () => {
  let mockIntersectionObserver: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockIntersectionObserver = vi.fn();
    mockDisconnect = vi.fn();

    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn((callback) => {
        mockIntersectionObserver.mockImplementation(callback);
        return {
          observe: vi.fn(),
          disconnect: mockDisconnect,
          unobserve: vi.fn(),
        };
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should call callback when element is intersecting", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useIntersectionObserver(callback));

    const node = document.createElement("div");
    result.current(node);

    const mockEntry = [{ isIntersecting: true }];
    mockIntersectionObserver(mockEntry);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("should not call callback when element is not intersecting", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useIntersectionObserver(callback));

    const node = document.createElement("div");
    result.current(node);

    const mockEntry = [{ isIntersecting: false }];
    mockIntersectionObserver(mockEntry);

    expect(callback).not.toHaveBeenCalled();
  });

  test("should disconnect observer when node is unmounted", () => {
    const { result } = renderHook(() => useIntersectionObserver(vi.fn()));

    const node = document.createElement("div");
    result.current(node);
    result.current(null);

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
