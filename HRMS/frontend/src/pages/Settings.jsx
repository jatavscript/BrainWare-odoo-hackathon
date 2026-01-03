import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Settings() {
  const { theme, setTheme, toggleTheme, prefs, setPrefs } = useTheme();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="card p-4 space-y-3">
          <div className="font-semibold">Appearance</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Theme</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Choose between Light and Dark mode</div>
            </div>
            <div className="flex items-center gap-2">
              <select className="border rounded-md px-3 py-2 bg-white dark:bg-gray-900" value={theme} onChange={(e)=>setTheme(e.target.value)}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
              <button className="btn" type="button" onClick={toggleTheme}>Toggle</button>
            </div>
          </div>
        </section>

        <section className="card p-4 space-y-3">
          <div className="font-semibold">Preferences</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Compact sidebar</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Reduce spacing in the navigation</div>
            </div>
            <input type="checkbox" className="h-5 w-5" checked={prefs.compactSidebar} onChange={(e)=>setPrefs(v=>({...v, compactSidebar: e.target.checked}))} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Enable notifications</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Show in-app announcement badges</div>
            </div>
            <input type="checkbox" className="h-5 w-5" checked={prefs.enableNotifications} onChange={(e)=>setPrefs(v=>({...v, enableNotifications: e.target.checked}))} />
          </div>
        </section>
      </div>
    </div>
  );
}
