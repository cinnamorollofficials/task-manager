import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, CheckSquare, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="glassmorphism sticky top-0 z-50 px-6 py-4 shadow-md transition-all duration-300 border-b border-m3-outline/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand/Logo */}
        <div className="flex items-center gap-2 text-m3-primary hover:opacity-95 transition-opacity">
          <div className="bg-m3-primaryContainer text-m3-onPrimaryContainer p-2 rounded-2xl flex items-center justify-center">
            <CheckSquare size={24} />
          </div>
          <span className="text-2xl font-black font-display tracking-tight bg-gradient-to-r from-m3-primary via-m3-secondary to-m3-tertiary bg-clip-text text-transparent">
            TaskMaster
          </span>
        </div>

        {/* User profile & Logout */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-m3-surfaceVariant/30 px-4 py-2 rounded-full border border-m3-outline/10">
              <div className="bg-m3-tertiaryContainer text-m3-onTertiaryContainer w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-m3-onSurface">{user.name}</span>
            </div>

            <button
              onClick={logout}
              className="bg-m3-error/10 hover:bg-m3-error hover:text-m3-onError text-m3-error border border-m3-error/20 font-semibold text-sm px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 m3-ripple shadow"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
