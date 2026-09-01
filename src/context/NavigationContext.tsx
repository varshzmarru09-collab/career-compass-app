import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export type AppRoute =
  | 'welcome'
  | 'auth'
  | 'login'
  | 'career-setup'
  | 'analyzer'
  | 'skill-analyzer'
  | 'roadmap'
  | 'progress'
  | 'training'
  | 'jobs'
  | 'application'
  | 'applications'
  | 'tracking'
  | 'skills'
  | 'profile'
  | 'dashboard';

interface RouteState {
  route: string;
  params?: Record<string, any>;
  index?: number;
  timestamp?: number;
}

interface NavigationContextType {
  currentRoute: string;
  routeParams: Record<string, any>;
  navigate: (route: string, params?: Record<string, any>, options?: { replace?: boolean }) => void;
  goBack: (fallbackRoute?: string) => void;
  canGoBack: boolean;
  historyStack: string[];
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Normalizes route aliases to canonical names
export const normalizeRoute = (rawRoute: string): string => {
  const clean = rawRoute.toLowerCase().replace(/^\/+/, '').replace(/\/+$/, '');
  switch (clean) {
    case '':
    case 'welcome':
      return 'welcome';
    case 'login':
    case 'signin':
    case 'auth':
      return 'auth';
    case 'setup':
    case 'career-setup':
    case 'career_setup':
      return 'career-setup';
    case 'skill-analyzer':
    case 'skill_analyzer':
    case 'analyzer':
      return 'analyzer';
    case 'progress':
    case 'career-progress':
    case 'roadmap':
      return 'roadmap';
    case 'courses':
    case 'training':
      return 'training';
    case 'job':
    case 'jobs':
      return 'jobs';
    case 'apply':
    case 'application':
      return 'application';
    case 'tracking':
    case 'applications':
      return 'applications';
    case 'my-skills':
    case 'skills':
      return 'skills';
    case 'profile':
      return 'profile';
    case 'dash':
    case 'dashboard':
    default:
      return clean || 'welcome';
  }
};

// Converts canonical route & params to a browser URL
export const getUrlForRoute = (route: string, params?: Record<string, any>): string => {
  const norm = normalizeRoute(route);
  let path = `/${norm}`;
  if (norm === 'welcome') {
    path = '/';
  }

  const queryParts: string[] = [];
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`);
      }
    });
  }

  if (queryParts.length > 0) {
    path += `?${queryParts.join('&')}`;
  }
  return path;
};

// Extracts route & query params from current window.location
export const parseCurrentLocation = (): { route: string; params: Record<string, any> } => {
  if (typeof window === 'undefined') {
    return { route: 'welcome', params: {} };
  }

  // Check hash first (if present e.g. #/jobs or #jobs)
  let rawPath = window.location.pathname;
  if (window.location.hash && window.location.hash.length > 1) {
    const hashContent = window.location.hash.substring(1).replace(/^\/+/, '');
    if (hashContent) {
      rawPath = `/${hashContent}`;
    }
  }

  const normRoute = normalizeRoute(rawPath);

  const searchParams = new URLSearchParams(window.location.search);
  const params: Record<string, any> = {};
  searchParams.forEach((val, key) => {
    params[key] = val;
  });

  return { route: normRoute, params };
};

// Logical default fallback for every screen in the student journey
export const getDefaultFallbackRoute = (currentRoute: string): string => {
  const norm = normalizeRoute(currentRoute);
  switch (norm) {
    case 'applications':
      return 'jobs';
    case 'application':
      return 'jobs';
    case 'jobs':
      return 'training';
    case 'training':
      return 'analyzer';
    case 'roadmap':
      return 'analyzer';
    case 'analyzer':
      return 'career-setup';
    case 'career-setup':
      return 'dashboard';
    case 'skills':
      return 'dashboard';
    case 'profile':
      return 'dashboard';
    case 'dashboard':
      return 'welcome';
    case 'auth':
      return 'welcome';
    case 'welcome':
    default:
      return 'welcome';
  }
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = parseCurrentLocation();
  const [currentRoute, setCurrentRoute] = useState<string>(initial.route);
  const [routeParams, setRouteParams] = useState<Record<string, any>>(initial.params);
  const [historyStack, setHistoryStack] = useState<string[]>([initial.route]);
  const historyIndexRef = useRef<number>(0);

  // Initialize initial history entry with structured state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const state = window.history.state as RouteState | null;
      if (!state || !state.route) {
        const url = getUrlForRoute(initial.route, initial.params);
        window.history.replaceState(
          {
            route: initial.route,
            params: initial.params,
            index: 0,
            timestamp: Date.now(),
          },
          '',
          url
        );
      } else {
        historyIndexRef.current = state.index || 0;
      }
    }
  }, []);

  // Listen for browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as RouteState | null;
      if (state && state.route) {
        const norm = normalizeRoute(state.route);
        setCurrentRoute(norm);
        setRouteParams(state.params || {});
        historyIndexRef.current = state.index ?? Math.max(0, historyIndexRef.current - 1);
        setHistoryStack((prev) => {
          if (prev[prev.length - 1] === norm) return prev;
          return [...prev, norm];
        });
      } else {
        // Fallback parse from window.location
        const loc = parseCurrentLocation();
        setCurrentRoute(loc.route);
        setRouteParams(loc.params);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = useCallback(
    (targetRoute: string, params: Record<string, any> = {}, options?: { replace?: boolean }) => {
      const norm = normalizeRoute(targetRoute);
      const url = getUrlForRoute(norm, params);

      if (options?.replace) {
        const nextIndex = historyIndexRef.current;
        window.history.replaceState(
          {
            route: norm,
            params,
            index: nextIndex,
            timestamp: Date.now(),
          },
          '',
          url
        );
        setCurrentRoute(norm);
        setRouteParams(params);
        setHistoryStack((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = norm;
          return copy;
        });
      } else {
        const nextIndex = historyIndexRef.current + 1;
        historyIndexRef.current = nextIndex;
        window.history.pushState(
          {
            route: norm,
            params,
            index: nextIndex,
            timestamp: Date.now(),
          },
          '',
          url
        );
        setCurrentRoute(norm);
        setRouteParams(params);
        setHistoryStack((prev) => [...prev, norm]);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  const goBack = useCallback(
    (fallbackRoute?: string) => {
      // Check if browser history has depth within our app
      if (typeof window !== 'undefined' && historyIndexRef.current > 0) {
        window.history.back();
      } else {
        const fallback = fallbackRoute || getDefaultFallbackRoute(currentRoute);
        navigate(fallback);
      }
    },
    [currentRoute, navigate]
  );

  const canGoBack = historyIndexRef.current > 0 || historyStack.length > 1;

  return (
    <NavigationContext.Provider
      value={{
        currentRoute,
        routeParams,
        navigate,
        goBack,
        canGoBack,
        historyStack,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
