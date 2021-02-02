import React, { ReactNode } from "react";
import { Logs } from "./components/core/log";

function App() {
  return (
    <Page>
      <Navbar>
        <h1 className="font-sans text-xl m-4">Console</h1>
      </Navbar>

      <Logs />
    </Page>
  );
}

function Page({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-screen bg-white flex flex-col">{children}</div>
  );
}

function Navbar({ children }: { children: ReactNode }) {
  return (
    <nav className="w-screen shadow flex flex-row items-center">{children}</nav>
  );
}

export default App;
