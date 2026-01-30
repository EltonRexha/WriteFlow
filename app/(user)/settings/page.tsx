'use client';
import React, { useState, useEffect } from 'react';
import { Palette, Check, Sun, Moon } from 'lucide-react';

interface Theme {
  name: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  preview: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
}

const themes: Theme[] = [
  {
    name: 'Emerald',
    value: 'emerald',
    description: 'Clean and modern green theme',
    icon: <Sun className="h-5 w-5" />,
    preview: {
      primary: 'bg-emerald-500',
      secondary: 'bg-emerald-400',
      accent: 'bg-emerald-600',
      neutral: 'bg-neutral-500'
    }
  },
  {
    name: 'Forest',
    value: 'forest',
    description: 'Dark nature-inspired theme',
    icon: <Moon className="h-5 w-5" />,
    preview: {
      primary: 'bg-green-700',
      secondary: 'bg-green-600',
      accent: 'bg-green-800',
      neutral: 'bg-neutral-700'
    }
  },
  {
    name: 'Lofi',
    value: 'lofi',
    description: 'Relaxed minimalist theme',
    icon: <Sun className="h-5 w-5" />,
    preview: {
      primary: 'bg-blue-600',
      secondary: 'bg-blue-500',
      accent: 'bg-blue-700',
      neutral: 'bg-stone-600'
    }
  },
  {
    name: 'Corporate',
    value: 'corporate',
    description: 'Professional business theme',
    icon: <Sun className="h-5 w-5" />,
    preview: {
      primary: 'bg-blue-700',
      secondary: 'bg-blue-600',
      accent: 'bg-blue-800',
      neutral: 'bg-gray-600'
    }
  },
  {
    name: 'Synthwave',
    value: 'synthwave',
    description: 'Neon retro-futuristic theme',
    icon: <Moon className="h-5 w-5" />,
    preview: {
      primary: 'bg-purple-600',
      secondary: 'bg-pink-500',
      accent: 'bg-purple-700',
      neutral: 'bg-stone-700'
    }
  },
  {
    name: 'Valentine',
    value: 'valentine',
    description: 'Romantic pink theme',
    icon: <Sun className="h-5 w-5" />,
    preview: {
      primary: 'bg-red-500',
      secondary: 'bg-pink-400',
      accent: 'bg-red-600',
      neutral: 'bg-stone-600'
    }
  },
  {
    name: 'Aqua',
    value: 'aqua',
    description: 'Fresh ocean-inspired theme',
    icon: <Sun className="h-5 w-5" />,
    preview: {
      primary: 'bg-cyan-600',
      secondary: 'bg-cyan-500',
      accent: 'bg-cyan-700',
      neutral: 'bg-stone-600'
    }
  },
  {
    name: 'Dracula',
    value: 'dracula',
    description: 'Dark vampire theme',
    icon: <Moon className="h-5 w-5" />,
    preview: {
      primary: 'bg-purple-700',
      secondary: 'bg-purple-600',
      accent: 'bg-pink-600',
      neutral: 'bg-gray-800'
    }
  }
];

const SettingsPage = () => {
  const [selectedTheme, setSelectedTheme] = useState('emerald');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    // Get current theme from localStorage or default
    const currentTheme = localStorage.getItem('theme') || 'emerald';
    setSelectedTheme(currentTheme);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, []);

  const handleThemeChange = (themeValue: string) => {
    setSelectedTheme(themeValue);
    document.documentElement.setAttribute('data-theme', themeValue);
    localStorage.setItem('theme', themeValue);
  };

  const handleSaveTheme = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Simulate saving to backend (you can implement actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('theme', selectedTheme);
      setSaveMessage('Theme saved successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000);
    } catch {
      setSaveMessage('Failed to save theme');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-base-100 border-b border-base-content/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Palette className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Settings</h1>
              <p className="text-base-content/60">
                Customize your experience and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Theme Selection */}
          <div className="bg-base-100 rounded-xl border border-base-content/10 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Palette className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-base-content">Theme Selection</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {themes.map((theme) => (
                <div
                  key={theme.value}
                  className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                    selectedTheme === theme.value
                      ? 'border-primary bg-primary/5'
                      : 'border-base-300 bg-base-200/50 hover:border-primary/50'
                  }`}
                  onClick={() => handleThemeChange(theme.value)}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {theme.icon}
                        <span className="font-medium text-base-content">{theme.name}</span>
                      </div>
                      {selectedTheme === theme.value && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    
                    <p className="text-sm text-base-content/60 mb-3">{theme.description}</p>
                    
                    {/* Theme Preview */}
                    <div className="flex gap-1">
                      <div className={`h-6 w-6 rounded ${theme.preview.primary}`}></div>
                      <div className={`h-6 w-6 rounded ${theme.preview.secondary}`}></div>
                      <div className={`h-6 w-6 rounded ${theme.preview.accent}`}></div>
                      <div className={`h-6 w-6 rounded ${theme.preview.neutral}`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">
                  Selected theme: <span className="font-medium text-base-content">{themes.find(t => t.value === selectedTheme)?.name}</span>
                </p>
                {saveMessage && (
                  <p className={`text-sm mt-1 ${saveMessage.includes('success') ? 'text-success' : 'text-error'}`}>
                    {saveMessage}
                  </p>
                )}
              </div>
              
              <button
                className="btn btn-primary"
                onClick={handleSaveTheme}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : (
                  'Save Theme'
                )}
              </button>
            </div>
          </div>

          {/* Additional Settings Info */}
          <div className="bg-base-100 rounded-xl border border-base-content/10 p-6">
            <h3 className="text-lg font-semibold text-base-content mb-4">About Themes</h3>
            <div className="space-y-3 text-sm text-base-content/70">
              <p>
                Themes change the overall appearance of your WriteFlow interface, including colors, 
                spacing, and visual styling.
              </p>
              <p>
                Your theme preference is saved locally and will be applied automatically 
                when you return to WriteFlow.
              </p>
              <p>
                Some themes are optimized for different lighting conditions - try themes with 
                moon icons for dark environments and sun icons for bright environments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
