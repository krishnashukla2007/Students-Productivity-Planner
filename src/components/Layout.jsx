import { Outlet } from "react-router-dom";
import { AppShell } from "./navigation/AppShell";

export function Layout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

