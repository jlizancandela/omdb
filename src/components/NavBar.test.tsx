import { MemoryRouter } from "react-router";
import { NavBar } from "./NavBar";
import { render } from "@testing-library/react";
import { Context } from "../context/Provider";
import { vi } from "vitest";

const renderWithWrapper = (entries: string[], lastPage = "") => {
  let fav: any[] = [];
  const setFav = vi.fn((newFav) => (fav = newFav));
  const setLastpage = vi.fn((newLastPage) => (lastPage = newLastPage));
  const wrapper = ({ children }: any) => (
    <Context.Provider value={{ fav, setFav, lastPage, setLastpage }}>
      <MemoryRouter initialEntries={entries}>{children}</MemoryRouter>
    </Context.Provider>
  );
  return render(<NavBar />, { wrapper });
};

describe("Navbar", () => {
  test("should render home and favorites", () => {
    const { getByText } = renderWithWrapper(["/"]);
    expect(getByText("Inicio")).toBeInTheDocument();
    expect(getByText("Favoritos")).toBeInTheDocument();
  });

  test("should render back button", () => {
    const { getByText } = renderWithWrapper(["/movie/123"], "search");
    expect(getByText("Volver")).toBeInTheDocument();
  });
});
