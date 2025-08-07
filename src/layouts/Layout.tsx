import { Outlet } from "react-router";
import { NavBar } from "../components/NavBar";
import { ScrollUp } from "../components/ScrollUp";

import styles from "./Layout.module.css";

export const Layout = () => {
  return (
    <>
      <NavBar />
      <main className={styles.layout}>
        <Outlet />
      </main>
      <ScrollUp />
    </>
  );
};
