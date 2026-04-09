import React from "react";
import { Code2, FolderOpen, Search } from "lucide-react";

function Menu() {
  return (
    <nav className="menu">
      <button className="menu-item">
        <Code2 size={18} />
        <span>Codex</span>
      </button>
      <button className="menu-item">
        <FolderOpen size={18} />
        <span>Projects</span>
      </button>
      <button className="menu-item">
        <Search size={18} />
        <span>Deep Search</span>
      </button>
    </nav>
  );
}

export default Menu;
