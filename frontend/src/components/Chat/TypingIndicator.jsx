import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex gap-4 max-w-4xl mx-auto px-6 py-4"
    >
      {/* Avatar */}
      <motion.div
        className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg"
      >
        <Bot className="w-4 h-4 text-white" />
      </motion.div>

      {/* Typing Content */}
      <div className="flex-1 mr-12">
        <div className="text-xs font-medium mb-2 text-green-400">
          Assistant
        </div>

        <div className="bg-slate-800/90 border border-white/10 rounded-2xl px-4 py-3 shadow-lg">
          <div className="flex items-center gap-1">
            <span className="text-gray-400 text-sm">AI is thinking</span>
            <div className="flex gap-1 ml-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;