import { render, fireEvent } from "@testing-library/react";
import { Search } from "./Search";
import { vi } from "vitest";

describe("Search", () => {
  const setSearch = vi.fn();

  beforeEach(() => {
    setSearch.mockClear(); // limpia los mocks antes de cada test
  });

  test("renders without crashing", () => {
    const { getByRole } = render(<Search setSearch={setSearch} />);
    expect(getByRole("textbox")).toBeInTheDocument();
  });

  test("calls setSearch when input changes", () => {
    const { getByRole } = render(<Search setSearch={setSearch} />);
    const input = getByRole("textbox");

    fireEvent.change(input, { target: { value: "test" } });

    expect(setSearch).toHaveBeenCalledWith("test");
  });
});
