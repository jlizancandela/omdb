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

  test("shows an accessible clear action only when the input has a value", () => {
    const { queryByRole, getByRole } = render(
      <Search setSearch={setSearch} value="spider" />
    );

    fireEvent.click(getByRole("button", { name: "Limpiar búsqueda" }));

    expect(setSearch).toHaveBeenCalledWith("");
    expect(queryByRole("button", { name: "Limpiar búsqueda" })).toBeInTheDocument();
  });
});
