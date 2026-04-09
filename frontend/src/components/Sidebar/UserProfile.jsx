import React, { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

function UserProfile() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="user-profile" ref={dropdownRef}>
      <button className="user-btn" onClick={() => setOpen(!open)}>
        <div className="avatar">M</div>
        <span className="user-name">Mani Kanta</span>
        <ChevronDown size={16} className={`chevron ${open ? "open" : ""}`} />
      </button>

      {open && (
        <div className="dropdown">
          <button className="dropdown-item">
            <User size={16} />
            <span>Profile</span>
          </button>
          <button className="dropdown-item">
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <div className="dropdown-divider" />
          <button className="dropdown-item logout">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
