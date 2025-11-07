import React from "react";
import Link from "next/link";

const routes = [
  { name: "Upload Data", path: "/data-uploads" },
  { name: "XPS TC", path: "/xps-test-cases" },
  { name: "eMember TC", path: "/emember-test-cases" },
  { name: "Test Case Data", path: "/test-cases" },
  { name: "XPS API", path: "/api/test-cases/xps" },
  { name: "eMember API", path: "/api/test-cases/emember" },
];

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 backdrop-blur z-50">
      <div className="max-w-5xl mx-auto h-full flex items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-bold text-blue-600 tracking-tight"
        >
          Test Case Manager
        </Link>
        <div className="flex items-center space-x-4">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className="px-3 py-1 rounded transition font-medium text-zinc-700 dark:text-zinc-200 hover:bg-blue-600 hover:text-white"
            >
              {route.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
