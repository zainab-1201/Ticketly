import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import AdminPage from "./Pages/AdminPage";
import BookingPage from "./Pages/BookingPage";
import EventDetailPage from "./Pages/EventDetailPage";
import EventsPage from "./Pages/EventsPage";
import HomePage from "./Pages/HomePage";
import TicketPage from "./Pages/TicketPage";

function useTheme() {
  const getInitialTheme = () => {
    const saved = localStorage.getItem("ticketly-theme");
    if (saved === "light" || saved === "dark") {
      return saved;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ticketly-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((curr) => (curr === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
}

function Header({ theme, onToggleTheme }) {
  const linkClass = ({ isActive }) =>
    `text-sm font-semibold tracking-wide transition-colors ${
      isActive ? "text-tk-gold" : "text-tk-muted hover:text-tk-text"
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-tk-border bg-tk-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <NavLink
          to="/"
          className="font-display text-2xl tracking-widest text-tk-gold"
        >
          TICKETLY
        </NavLink>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/events" className={linkClass}>
            Events
          </NavLink>
          <NavLink to="/admin" className={linkClass}>
            Admin
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={onToggleTheme}
          className="btn-ghost px-4 py-2 text-sm"
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </header>
  );
}

function App() {
  const { theme, toggleTheme } = useTheme();

  const appShellClass = useMemo(
    () => "min-h-screen bg-tk-bg text-tk-text transition-colors duration-300",
    [],
  );

  return (
    <BrowserRouter>
      <div className={appShellClass}>
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/ticket/:ticketId" element={<TicketPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
