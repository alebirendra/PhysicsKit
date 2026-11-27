import { useEffect, useRef, useState } from 'react';
import {
  Atom,
  BookOpen,
  Compass,
  FlaskConical,
  GraduationCap,
  Home,
  Info,
  Menu,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  X,
} from 'lucide-react';
import type { AppRoute, SearchResultItem, SimulationId } from '../../types/physics';
import { searchPhysicsContent } from '../../services/search/globalSearch';

export interface NavDestination {
  route: AppRoute;
  label: string;
  icon: typeof Home;
}

const NAV_ITEMS: NavDestination[] = [
  { route: 'home', label: 'Home', icon: Home },
  { route: 'explore', label: 'Explore Physics', icon: Compass },
  { route: 'simulations', label: 'Simulations', icon: FlaskConical },
  { route: 'resources', label: 'Learning Resources', icon: BookOpen },
  { route: 'practice', label: 'Practice', icon: GraduationCap },
  { route: 'tutor', label: 'AI Physics Tutor', icon: MessageSquare },
  { route: 'about', label: 'About', icon: Info },
];

interface AppShellProps {
  currentRoute: AppRoute;
  onNavigate: (
    route: AppRoute,
    params?: { subjectId?: string; chapterId?: string; topicId?: string; simId?: SimulationId; questionId?: string },
  ) => void;
  children: React.ReactNode;
}

export function AppShell({ currentRoute, onNavigate, children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.trim().length > 0 ? searchPhysicsContent(searchQuery, 10) : [];

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSelectResult = (item: SearchResultItem) => {
    setSearchOpen(false);
    setSearchQuery('');
    onNavigate(item.route, item.params);
  };

  const isRouteActive = (route: AppRoute) => {
    if (route === 'explore' && (currentRoute === 'subject' || currentRoute === 'chapter')) return true;
    return currentRoute === route;
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC] text-[#0F172A]">
      {/* Desktop Left Navigation Rail */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 border-r border-slate-200 bg-white transition-all duration-200 ${
          sidebarCollapsed ? 'w-16' : 'w-60'
        }`}
        aria-label="Primary navigation"
      >
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200">
          {!sidebarCollapsed && (
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-left focus-visible:outline-2 focus-visible:outline-blue-600 rounded-md"
            >
              <Atom className="w-5 h-5 text-blue-600 shrink-0" aria-hidden="true" />
              <span className="font-bold text-lg tracking-tight text-slate-900 whitespace-nowrap">
                PhysicsKit
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setSidebarCollapsed((c) => !c)}
            aria-label={sidebarCollapsed ? 'Expand navigation sidebar' : 'Collapse navigation sidebar'}
            className="p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-2.5 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isRouteActive(item.route);
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => onNavigate(item.route)}
                title={sidebarCollapsed ? item.label : undefined}
                aria-current={active ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {!sidebarCollapsed && (
          <div className="p-4 border-t border-slate-200 space-y-2">
            <p className="text-xs font-medium text-slate-500">Active Chapters</p>
            <button
              type="button"
              onClick={() => onNavigate('chapter', { chapterId: 'vectors' })}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
            >
              <div className="text-[11px] text-slate-500">Classical Mechanics</div>
              <div className="text-sm font-semibold text-slate-900 mt-0.5">Ch. 1 · Vectors</div>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('chapter', { chapterId: 'kinematics' })}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
            >
              <div className="text-[11px] text-slate-500">Classical Mechanics</div>
              <div className="text-sm font-semibold text-slate-900 mt-0.5">Ch. 2 · 1D Kinematics</div>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('chapter', { chapterId: 'kinematics-2d' })}
              className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
            >
              <div className="text-[11px] text-slate-500">Classical Mechanics</div>
              <div className="text-sm font-semibold text-slate-900 mt-0.5">Ch. 3 · 2D Kinematics</div>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar (Compact Mobile Header + Desktop Global Search Strip) */}
        <header className="sticky top-0 z-30 h-14 bg-white/95 border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 -ml-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 font-bold text-base tracking-tight text-slate-900 whitespace-nowrap"
            >
              <Atom className="w-5 h-5 text-blue-600" aria-hidden="true" />
              <span>PhysicsKit</span>
            </button>
          </div>

          {/* Global Search Input (Desktop / Tablet) */}
          <div ref={searchWrapRef} className="relative flex-1 max-w-xl hidden sm:block">
            <label htmlFor="global-physics-search" className="sr-only">
              Search PhysicsKit topics, simulations, equations, and exercises
            </label>
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="global-physics-search"
              type="search"
              value={searchQuery}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              placeholder="Search concepts, simulations, or equations (e.g. cross product)..."
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
            />

            {searchOpen && searchQuery.trim().length > 0 && (
              <div
                role="listbox"
                aria-label="Search results"
                className="absolute left-0 right-0 top-11 bg-white border border-slate-200 rounded-xl shadow-lg max-h-96 overflow-y-auto z-50 divide-y divide-slate-100"
              >
                {searchResults.length === 0 ? (
                  <div className="p-4 text-sm text-slate-500">
                    No matching topics, simulations, or equations found for “{searchQuery}”.
                  </div>
                ) : (
                  searchResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      aria-selected="false"
                      onClick={() => handleSelectResult(item)}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors flex flex-col gap-0.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-slate-900">{item.title}</span>
                        <span className="text-xs text-blue-600 font-medium shrink-0">{item.category}</span>
                      </div>
                      <span className="text-xs text-slate-500 line-clamp-1">{item.subtitle}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setMobileSearchOpen((v) => !v)}
              aria-label="Toggle search bar"
              className="sm:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('simulations')}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
            >
              Simulation Lab
            </button>
          </div>
        </header>

        {/* Expandable Mobile Search Strip (< sm) */}
        {mobileSearchOpen && (
          <div className="sm:hidden bg-white border-b border-slate-200 px-4 py-2.5 relative z-20">
            <label htmlFor="mobile-physics-search" className="sr-only">
              Search PhysicsKit
            </label>
            <input
              id="mobile-physics-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, simulations, equations..."
              className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
            />
            {searchQuery.trim().length > 0 && (
              <div className="mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-72 overflow-y-auto divide-y divide-slate-100">
                {searchResults.length === 0 ? (
                  <div className="p-3 text-xs text-slate-500">No matches found.</div>
                ) : (
                  searchResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setMobileSearchOpen(false);
                        handleSelectResult(item);
                      }}
                      className="w-full text-left px-3 py-2.5 hover:bg-slate-50 flex flex-col gap-0.5"
                    >
                      <span className="text-xs font-semibold text-slate-900">{item.title}</span>
                      <span className="text-xs text-blue-600">{item.category}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/40"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-xl flex flex-col z-10">
              <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200">
                <span className="font-bold text-base text-slate-900">PhysicsKit</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isRouteActive(item.route);
                  return (
                    <button
                      key={item.route}
                      type="button"
                      onClick={() => {
                        onNavigate(item.route);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium whitespace-nowrap ${
                        active ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Active Page Stage */}
        <main className="flex-1 min-w-0">{children}</main>

        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-3">
          <span>PhysicsKit · Understand Physics. See It. Explore It.</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('chapter', { chapterId: 'vectors' })}
              className="hover:text-slate-900 transition-colors"
            >
              Ch. 1 · Vectors
            </button>
            <button
              type="button"
              onClick={() => onNavigate('chapter', { chapterId: 'kinematics' })}
              className="hover:text-slate-900 transition-colors"
            >
              Ch. 2 · 1D Kinematics
            </button>
            <button
              type="button"
              onClick={() => onNavigate('chapter', { chapterId: 'kinematics-2d' })}
              className="hover:text-slate-900 transition-colors"
            >
              Ch. 3 · 2D Kinematics
            </button>
            <button
              type="button"
              onClick={() => onNavigate('simulations')}
              className="hover:text-slate-900 transition-colors"
            >
              Simulation Lab
            </button>
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="hover:text-slate-900 transition-colors"
            >
              About
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
