import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, isDark } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-secondary transition-colors text-foreground"
        title="Change theme"
      >
        {isDark ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.64 15.95c-.18-.96-.46-1.88-.84-2.75.07-.04.14-.08.21-.12 1.12-.74 1.86-1.87 1.86-3.13 0-2.15-1.74-3.89-3.89-3.89-.59 0-1.14.14-1.64.38C17.9 3.54 16.34 2 14.5 2c-.5 0-.98.1-1.42.29.7.39 1.32.88 1.84 1.45.47.54.87 1.11 1.19 1.73.22-.07.46-.11.71-.11 1.24 0 2.32.8 2.75 1.91.36.04.71.13 1.04.27.49-.91.81-1.92.88-3.01C21.95 10.91 22 11.94 22 13c0 1.42-.15 2.8-.43 4.12-.07.36-.16.73-.24 1.1-.35 1.81-1 3.54-1.87 5.09-.33.63-.68 1.24-1.07 1.83l-.03.05c-.41.67-.87 1.32-1.38 1.93-.21.23-.43.45-.65.67-.43-.43-.85-.88-1.24-1.36-.3-.39-.59-.79-.86-1.21l-.03-.05c-.36-.54-.71-1.1-1.04-1.68l-.03-.05c-.35-.62-.66-1.26-.96-1.92-.13-.29-.25-.59-.36-.89-.48-1.45-.75-3.01-.75-4.61 0-.31.01-.61.03-.91.05-1.07.19-2.11.43-3.1.71-2.85 2.11-5.35 4.1-7.2.31-.28.62-.54.94-.79.32.24.63.51.94.79 1.99 1.85 3.39 4.35 4.1 7.2.24 1 .38 2.04.43 3.1.02.3.03.6.03.91 0 1.6-.27 3.16-.75 4.61-.11.3-.23.6-.36.89-.3.66-.61 1.3-.96 1.92l-.03.05c-.33.58-.68 1.14-1.04 1.68l-.03.05c-.27.42-.56.82-.86 1.21-.39.48-.81.93-1.24 1.36.22-.22.44-.44.65-.67.51-.61.97-1.26 1.38-1.93l.03-.05c.39-.59.74-1.2 1.07-1.83.87-1.55 1.52-3.28 1.87-5.09z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 18c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6m0-10c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zM13 2h-2v3h2V2zm0 15h-2v3h2v-3zM5 11H2v2h3v-2zm15 0h-3v2h3v-2zM6.3 5.3L4.2 3.2 2.8 4.6l2.1 2.1 1.4-1.4zm11.4 11.4l-1.4 1.4 2.1 2.1 1.4-1.4-2.1-2.1zM19 6.3l2.1-2.1-1.4-1.4-2.1 2.1 1.4 1.4zM7.7 17.7l-2.1 2.1 1.4 1.4 2.1-2.1-1.4-1.4z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border py-2 z-50">
          <button
            onClick={() => {
              setTheme('light');
              setIsOpen(false);
            }}
            className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
              theme === 'light'
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-secondary'
            }`}
          >
            ☀️ Light Mode
          </button>
          <button
            onClick={() => {
              setTheme('dark');
              setIsOpen(false);
            }}
            className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-secondary'
            }`}
          >
            🌙 Dark Mode
          </button>
          <button
            onClick={() => {
              setTheme('system');
              setIsOpen(false);
            }}
            className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
              theme === 'system'
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-secondary'
            }`}
          >
            🖥️ System Theme
          </button>
        </div>
      )}
    </div>
  );
};
