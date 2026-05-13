import React from "react";
import { motion } from "framer-motion";
import { Code2, FolderOpen, Search } from "lucide-react";

function Menu() {
  const menuItems = [
    { icon: Code2, label: "Codex", comingSoon: false },
    { icon: FolderOpen, label: "Projects", comingSoon: true },
    { icon: Search, label: "Deep Search", comingSoon: true },
  ];

  return (
    <nav className="space-y-1">
      {menuItems.map((item, index) => (
        <motion.button
          key={item.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={item.comingSoon}
          className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
            item.comingSoon
              ? 'opacity-50 cursor-not-allowed text-gray-500'
              : 'hover:bg-white/5 text-gray-300 hover:text-white'
          }`}
        >
          <item.icon className="w-5 h-5" />
          <span className="text-sm font-medium">{item.label}</span>
          {item.comingSoon && (
            <span className="ml-auto text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full">
              Soon
            </span>
          )}
        </motion.button>
      ))}
    </nav>
  );
}

export default Menu;
