export default function Navbar({ theme, setTheme }) {
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="bg-indigo-600 dark:bg-slate-800 p-4 flex justify-between items-center">

      <button
        onClick={toggleTheme}
        className="px-3 py-1 rounded 
                   bg-white text-slate-800 
                   dark:bg-slate-700 dark:text-slate-100
                   hover:opacity-90 transition"
      >
        {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
      </button>
    </nav>
  );
}
