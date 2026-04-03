import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Home,
  User,
  Gamepad2,
  Monitor,
  Settings,
  Mic2,
  LogIn,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";

export default function Layout() {
  const location = useLocation();
  const {
    user,
    profile,
    isAuthenticated,
    isAdmin,
    isHost,
    loginWithGoogle,
    logout,
  } = useAuth();

  const displayName =
    profile?.full_name ||
    profile?.username ||
    user?.displayName ||
    user?.email ||
    "Account";

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/game-room", icon: Gamepad2, label: "Game Room" },
    { path: "/scoreboard", icon: Monitor, label: "Scoreboard" },
    // { path: "/profile", icon: User, label: "Profile" },
  ];

  if (isHost || isAdmin) {
    navItems.splice(2, 0, {
      path: "/host",
      icon: Settings,
      label: "Host Controls",
    });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Mic2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl tracking-wider text-foreground leading-none">
                THE BASEMENT TALK
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-medium">
                Podcast Games
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {profile && (
            <Link
              key={"profile"}
              to={"/profile"}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-foreground">
                    {profile.display_name || profile.full_name}
                  </p>
                  <p className="text-xs text-primary capitalize">
                    {profile.role || "viewer"}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-primary/20 border-2 border-primary/40 overflow-hidden">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary font-bold text-sm">
                      {(profile.display_name ||
                        profile.full_name ||
                        "?")[0].toUpperCase()}
                    </div>
                  )}
                </div>
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={logout}
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={loginWithGoogle}
                    className="font-body bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
                  >
                    <LogIn className="w-4 h-4" /> Sign In
                  </Button>
                )}
              </div>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border/50 bg-card/95 backdrop-blur-xl z-50">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
