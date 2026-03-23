import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { LogOut, MessageSquare, Settings, User } from 'lucide-react'

const Navbar = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <nav className="navbar bg-base-200 border-b border-base-300 px-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-lg gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          ChatApp
        </Link>
      </div>
      <div className="flex gap-2">
        <Link to="/settings" className="btn btn-ghost btn-sm gap-1">
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Settings</span>
        </Link>

        {authUser ? (
          <>
            <Link to="/profile" className="btn btn-ghost btn-sm gap-1">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <button onClick={logout} className="btn btn-ghost btn-sm gap-1">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
