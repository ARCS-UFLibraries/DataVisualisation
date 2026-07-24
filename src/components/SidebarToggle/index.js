import React from "react";
import { useSidebar } from "../../context/SidebarContext";
import "./styles.css";

export default function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      className="sidebar-toggle-btn"
      onClick={toggleSidebar}
      aria-label="Toggle sidebar"
    >
      ☰
    </button>
  );
}