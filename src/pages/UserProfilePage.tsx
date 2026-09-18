import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  MoreHorizontal,
  Phone,
  Mail,
  Globe,
  MapPin,
  ShieldCheck,
  Plus,
  Moon,
  Sun,
  Settings,
  LogOut,
  Key,
  Image as ImageIcon,
  UserCheck,
  X,
  Check,
  Upload,
  Link2,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export interface WallpaperOption {
  id: string;
  name: string;
  url: string;
  category?: string;
}

const DEFAULT_COVER = '/wallpapers/black-hole-astronaut-spiral-galaxy-stars-space-exploration-3840x2400-2482.jpg';

const WALLPAPER_OPTIONS: WallpaperOption[] = [
  {
    id: 'black-hole-astronaut',
    name: 'Black Hole Astronaut Spiral Galaxy',
    url: '/wallpapers/black-hole-astronaut-spiral-galaxy-stars-space-exploration-3840x2400-2482.jpg',
    category: 'Space & Cosmos'
  },
  {
    id: 'gargantua-endurance',
    name: 'Gargantua Endurance Space',
    url: '/wallpapers/gargantua-endurance-5120x3662-25445.jpg',
    category: 'Space & Cosmos'
  },
  {
    id: 'astronaut-space-suit',
    name: 'Astronaut Space Suit ISS Exploration',
    url: '/wallpapers/astronaut-space-suit-dark-exploration-iss-nasa-5200x3250-8229.jpg',
    category: 'Space & Cosmos'
  },
  {
    id: 'wormhole-black-hole',
    name: 'Wormhole Black Hole Cosmos',
    url: '/wallpapers/wormhole-black-hole-astronaut-cosmos-planet-asteroids-5200x3250-7686.jpg',
    category: 'Space & Cosmos'
  },
  {
    id: 'artemis-ii-nasa',
    name: 'Artemis II NASA Launch 5K',
    url: '/wallpapers/artemis-ii-nasa-5k-5200x3250-25357.jpg',
    category: 'Space & Cosmos'
  },
  {
    id: 'nasa-laser',
    name: 'NASA Deep Space Laser',
    url: '/wallpapers/nasa-laser-5200x3250-20860.jpg',
    category: 'Space & Cosmos'
  },
  {
    id: 'tron-ares-movie',
    name: 'Tron Ares Movie Sci-Fi',
    url: '/wallpapers/tron-ares-movie-6000x4000-23270.jpg',
    category: 'Sci-Fi & Cyberpunk'
  },
  {
    id: 'tron-ares-red',
    name: 'Tron Ares Neon Red',
    url: '/wallpapers/tron-ares-red-3840x2702-22155.jpg',
    category: 'Sci-Fi & Cyberpunk'
  },
  {
    id: 'ghost-modern',
    name: 'Ghost Modern Abstract 8K',
    url: '/wallpapers/ghost-modern-7655x4320-10953.jpg',
    category: 'Abstract & Dark'
  },
  {
    id: 'alienware-glowing',
    name: 'Alienware Glowing Neon',
    url: '/wallpapers/alienware-glowing-3840x2160-14352.jpeg',
    category: 'Sci-Fi & Cyberpunk'
  },
  {
    id: 'muscle-car-retro',
    name: 'Muscle Car Retro Vintage Sunset',
    url: '/wallpapers/muscle-car-retro-vintage-car-sunset-neon-5k-4960x3507-1229.jpg',
    category: 'Automotive & Sunset'
  },
  {
    id: 'porsche-911-gt3',
    name: 'Porsche 911 GT3 RS Dark',
    url: '/wallpapers/porsche-911-gt3-rs-3840x2160-20432.png',
    category: 'Automotive & Sunset'
  },
  {
    id: 'guts-berserk',
    name: 'Guts Berserk Dark Knight',
    url: '/wallpapers/guts-berserk-dark-5120x2880-19127.jpg',
    category: 'Anime & Gaming'
  },
  {
    id: 'vegeta-super-saiyan',
    name: 'Vegeta Super Saiyan',
    url: '/wallpapers/vegeta-super-saiyan-5120x2880-17604.jpg',
    category: 'Anime & Gaming'
  },
  {
    id: 'goku-perfected',
    name: 'Goku Perfected Ultra Instinct',
    url: '/wallpapers/goku-perfected-5120x2880-25454.jpg',
    category: 'Anime & Gaming'
  },
  {
    id: 'goku-limit',
    name: 'Son Goku Limit Breaker',
    url: '/wallpapers/son-goku-limit-5120x2880-12438.jpg',
    category: 'Anime & Gaming'
  },
  {
    id: 'windows-11-amoled',
    name: 'Windows 11 Red Abstract Amoled',
    url: '/wallpapers/windows-11-stock-red-abstract-black-background-amoled-3840x2400-9058.jpg',
    category: 'Abstract & Dark'
  },
  {
    id: 'ios-13-amoled',
    name: 'iOS Stock Red Amoled HD',
    url: '/wallpapers/ios-13-stock-ipados-red-black-background-amoled-hd-3208x3208-799.jpg',
    category: 'Abstract & Dark'
  },
  {
    id: 'sunrise-desert',
    name: 'Sunrise Desert Sand 5K',
    url: '/wallpapers/sunrise-desert-sand-5120x2880-21157.jpg',
    category: 'Nature & Landscapes'
  }
];

export const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'timeline' | 'about' | 'friends' | 'photos' | 'settings'>('about');
  
  // Cover Photo State (Defaults to black hole astronaut space wallpaper)
  const [coverImage, setCoverImage] = useState<string>(() => {
    return localStorage.getItem('opendev_user_cover') || DEFAULT_COVER;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  const handleSelectCover = (url: string) => {
    setCoverImage(url);
    localStorage.setItem('opendev_user_cover', url);
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    handleSelectCover(customUrl.trim());
    setCustomUrl('');
    setIsModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        handleSelectCover(result);
        setIsModalOpen(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const userName = user?.name || (user?.email ? user.email.split('@')[0] : 'Yash Ramteke');
  const userEmail = user?.email || 'yashramteke55555@gmail.com';
  const userPhone = '+91 81695 68582';
  const userAvatar = user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="p-2 sm:p-4 lg:p-6 w-full max-w-7xl mx-auto space-y-6 text-zinc-900 dark:text-zinc-100 font-sans">
      
      {/* 1. Main Profile Cover Card (Matching Reference Design) */}
      <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
        
        {/* Cover Photo Header */}
        <div className="relative h-64 sm:h-80 w-full bg-zinc-950 overflow-hidden">
          <img
            src={coverImage}
            alt="Profile Cover Wallpaper"
            className="w-full h-full object-cover object-center transition-all duration-500"
            onError={(e) => {
              // Fallback to default if image fails to load
              (e.target as HTMLImageElement).src = DEFAULT_COVER;
            }}
          />
          {/* Subtle gradient shadow at the bottom for typography overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* User Name & Profile Avatar Overlayed directly on Cover Photo */}
          <div className="absolute bottom-4 left-6 sm:bottom-6 sm:left-8 flex items-end gap-4 sm:gap-6 z-10">
            <div className="relative shrink-0">
              <img
                src={userAvatar}
                alt={userName}
                className="size-24 sm:size-32 rounded-full border-4 border-white dark:border-zinc-900 object-cover shadow-2xl"
              />
              <span className="absolute bottom-1 right-1 size-4 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900" title="Active Status" />
            </div>

            <div className="pb-1 sm:pb-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                {userName}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-200 font-medium drop-shadow-xs">
                {user?.role === 'developer' ? 'Lead Developer & Architect' : user?.role === 'client' ? 'Client Partner' : 'Registered Gateway User'}
              </p>
            </div>
          </div>

          {/* Edit Cover Photo Action Button (Bottom Right of Cover) */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 border border-white/30 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Select Profile Cover Wallpaper"
            >
              <Camera className="size-4" />
              <span>Edit Cover</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar (Immediately beneath Cover Photo) */}
        <div className="bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800/80 px-6 sm:px-8 py-1 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-6 sm:gap-8 min-w-max text-xs sm:text-sm font-semibold">
            {/* Timeline Tab */}
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-3.5 border-b-2 transition-colors ${
                activeTab === 'timeline'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Timeline
            </button>

            {/* About Tab (Active default) */}
            <button
              onClick={() => setActiveTab('about')}
              className={`py-3.5 border-b-2 transition-colors ${
                activeTab === 'about'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              About
            </button>

            {/* Friends / Network Tab */}
            <button
              onClick={() => setActiveTab('friends')}
              className={`py-3.5 border-b-2 transition-colors ${
                activeTab === 'friends'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Friends <span className="text-zinc-400 font-normal ml-1">580</span>
            </button>

            {/* Photos Tab */}
            <button
              onClick={() => setActiveTab('photos')}
              className={`py-3.5 border-b-2 transition-colors ${
                activeTab === 'photos'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Photos
            </button>

            {/* Settings & Security Tab */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-3.5 border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Settings & Security
            </button>
          </div>

          <div className="flex items-center gap-2 pl-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              title="Toggle Light/Dark Mode"
            >
              {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4 text-amber-400" />}
            </button>

            <button
              className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors"
              title="More Options"
            >
              <MoreHorizontal className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Tab Content Card ("About" View matching Reference Design) */}
      {activeTab === 'about' && (
        <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-4">
            About
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            
            {/* Left Column Items */}
            <div className="space-y-6">
              
              {/* Item 1: Work / Role */}
              <div className="flex items-start gap-4">
                <div className="size-11 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  YR
                </div>
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 block">
                    Registered Client Partner at <span className="text-blue-600 dark:text-blue-400 font-bold">OpenDev-Labs</span>
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block font-medium">
                    Past: Web Client Gateway & Custom Software Solutions
                  </span>
                </div>
              </div>

              {/* Item 2: Upgrade / Convert to Client */}
              <Link to="/client/convert" className="flex items-start gap-4 group">
                <div className="size-11 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700">
                  <Plus className="size-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 block group-hover:text-amber-600 transition-colors">
                    Client Portal 🔑
                  </span>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-bold block">
                    Upgrade account for dedicated retainers & milestones
                  </span>
                </div>
              </Link>

              {/* Item 3: Location */}
              <div className="flex items-start gap-4">
                <div className="size-11 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700">
                  <MapPin className="size-5 text-red-500" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 block">
                    Lives in <span className="text-zinc-900 dark:text-white font-bold">Mumbai, India</span>
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block font-medium">
                    Originally from Maharashtra, India
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column Items */}
            <div className="space-y-6">
              
              {/* Item 4: Account Security & Auth */}
              <div className="flex items-start gap-4">
                <div className="size-11 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                  <UserCheck className="size-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 block">
                    Google OAuth 2.0 <span className="text-emerald-600 dark:text-emerald-400 font-bold">Encrypted & Verified</span>
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block font-medium">
                    Active Session • OpenDev-Labs Sovereign Gateway
                  </span>
                </div>
              </div>

              {/* Item 5: Phone Number */}
              <div className="flex items-start gap-4">
                <div className="size-11 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700">
                  <Phone className="size-5 text-indigo-500" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 block">
                    {userPhone}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block font-medium">
                    WhatsApp & Official Direct Phone Support
                  </span>
                </div>
              </div>

              {/* Item 6: Web Domain & Email */}
              <div className="flex items-start gap-4">
                <div className="size-11 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700">
                  <Globe className="size-5 text-purple-500" />
                </div>
                <div className="space-y-0.5">
                  <a
                    href="https://www.opendev-labs.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline block"
                  >
                    {userEmail}
                  </a>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block font-medium">
                    https://www.opendev-labs.com
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 3. Settings & Security Tab Content */}
      {activeTab === 'settings' && (
        <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-4">
            Settings & Security Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  <Moon className="size-4" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 block">Dark Mode</span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Toggle dark / light appearance</span>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-zinc-900 dark:bg-white justify-end' : 'bg-zinc-200 justify-start'
                }`}
              >
                <motion.div
                  layout
                  className={`size-4 rounded-full ${theme === 'dark' ? 'bg-white dark:bg-black' : 'bg-white'} shadow-sm`}
                />
              </button>
            </div>

            {/* Account Permissions */}
            <Link
              to="/client/security"
              className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  <ShieldCheck className="size-4 text-emerald-500" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 block">Security Overview</span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">OAuth permissions & session logs</span>
                </div>
              </div>
              <Settings className="size-4 text-zinc-400 group-hover:rotate-45 transition-transform" />
            </Link>

            {/* Log Out Button */}
            <button
              onClick={handleLogout}
              className="md:col-span-2 flex items-center justify-between p-4 bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl hover:bg-red-100/60 dark:hover:bg-red-950/40 transition-colors text-left group text-red-600 dark:text-red-400"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-400">
                  <LogOut className="size-4" />
                </div>
                <div>
                  <span className="text-sm font-bold block">Log out</span>
                  <span className="text-[11px] text-red-500/80 dark:text-red-400/80">Sign out of current active session</span>
                </div>
              </div>
              <LogOut className="size-4 text-red-400 group-hover:translate-x-1 transition-transform" />
            </button>

          </div>
        </div>
      )}

      {/* 4. Timeline / Photos Placeholder for other tabs */}
      {(activeTab === 'timeline' || activeTab === 'friends' || activeTab === 'photos') && (
        <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-xs space-y-3">
          <div className="size-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
            <ImageIcon className="size-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white capitalize">
            {activeTab} Feed
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            No active media or timeline updates posted yet. Check back soon for project milestones.
          </p>
        </div>
      )}

      {/* 5. COVER WALLPAPER SELECTOR MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    <Camera className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                      Choose Profile Cover Wallpaper
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Select high-resolution space, sci-fi, anime, and amoled wallpapers
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Modal Content - Wallpapers Grid & Custom Upload */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                
                {/* Wallpapers Grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">
                      Available Wallpapers ({WALLPAPER_OPTIONS.length})
                    </h4>
                    <button
                      onClick={() => handleSelectCover(DEFAULT_COVER)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="size-3" /> Reset to Black Hole Space Default
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {WALLPAPER_OPTIONS.map((wp) => {
                      const isSelected = coverImage === wp.url;
                      return (
                        <div
                          key={wp.id}
                          onClick={() => {
                            handleSelectCover(wp.url);
                          }}
                          className={`group relative h-36 rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? 'border-indigo-600 ring-2 ring-indigo-500/50 scale-[1.02]'
                              : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                          }`}
                        >
                          <img
                            src={wp.url}
                            alt={wp.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          
                          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                            <span className="text-xs font-bold text-white truncate drop-shadow-md">
                              {wp.name}
                            </span>
                            {isSelected && (
                              <span className="size-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                                <Check className="size-3.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Image URL or Upload Section */}
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Custom URL form */}
                  <form onSubmit={handleApplyCustomUrl} className="space-y-2">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Link2 className="size-3.5 text-indigo-500" /> Custom Image Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        placeholder="Paste image URL..."
                        className="flex-1 h-9 px-3 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="submit"
                        className="h-9 px-3 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </form>

                  {/* Local file upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Upload className="size-3.5 text-indigo-500" /> Upload Local Image
                    </label>
                    <label className="h-9 px-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
                      <Upload className="size-4" />
                      <span>Choose wallpaper file...</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  Done
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default UserProfilePage;




