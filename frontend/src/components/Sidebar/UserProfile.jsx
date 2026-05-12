import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function UserProfile() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

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
        <div className="avatar">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          ) : (
            getInitials(user?.displayName || user?.email)
          )}
        </div>
        <span className="user-name">{user?.displayName || user?.email || 'User'}</span>
        <ChevronDown size={16} className={`chevron ${open ? "open" : ""}`} />
      </button>

      {open && (
        <div className="dropdown">
          <button className="dropdown-item" onClick={() => { navigate('/profile'); setOpen(false); }}>
            <User size={16} />
            <span>Profile</span>
          </button>
          <button className="dropdown-item" onClick={() => { navigate('/settings'); setOpen(false); }}>
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <div className="dropdown-divider" />
          <button
            className="dropdown-item logout"
            onClick={() => {
              logout();
              setOpen(false);
            }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
