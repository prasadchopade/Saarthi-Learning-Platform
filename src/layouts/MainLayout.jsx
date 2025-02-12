import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Common/Navbar";
import Sidebar from "../components/Common/Sidebar";
import Footer from "../components/Common/Footer";
import { useSidebar } from "../context/SideBarContext";

const MainLayout = () => {
  const { collapsed } = useSidebar();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col pt-16">
        <div className="flex flex-1 dark:bg-zinc-900">
          <Sidebar />
          <main className={`flex-1  transition-all duration-300  dark:bg-zinc-900 ${
            collapsed ? "ml-16" : "ml-64"
          }`}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
