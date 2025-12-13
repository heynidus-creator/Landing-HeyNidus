import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';

function getSource(): string {
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source')?.toLowerCase();
  
  if (utmSource) {
    if (utmSource.includes('facebook') || utmSource === 'fb') return 'facebook';
    if (utmSource.includes('instagram') || utmSource === 'ig') return 'instagram';
    if (utmSource.includes('tiktok')) return 'tiktok';
    if (utmSource.includes('google')) return 'google';
    if (utmSource.includes('youtube') || utmSource === 'yt') return 'youtube';
    if (utmSource.includes('twitter') || utmSource === 'x') return 'twitter';
    return utmSource;
  }

  const referrer = document.referrer.toLowerCase();
  if (!referrer) return 'direct';
  
  if (referrer.includes('facebook.com') || referrer.includes('fb.com')) return 'facebook';
  if (referrer.includes('instagram.com')) return 'instagram';
  if (referrer.includes('tiktok.com')) return 'tiktok';
  if (referrer.includes('google.')) return 'google';
  if (referrer.includes('youtube.com')) return 'youtube';
  if (referrer.includes('twitter.com') || referrer.includes('x.com')) return 'twitter';
  
  return 'otro';
}

function extractProjectId(pathname: string): string | null {
  const match = pathname.match(/^\/proyecto\/([^/]+)/);
  return match ? match[1] : null;
}

function extractBlogId(pathname: string): string | null {
  const match = pathname.match(/^\/blog\/([^/]+)/);
  return match ? match[1] : null;
}

export function useAnalytics() {
  const [location] = useLocation();
  const startTimeRef = useRef<number>(Date.now());
  const lastPageRef = useRef<string>('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const sendAnalytics = useCallback(async (page: string, seconds: number, isPageView = false) => {
    if (page.startsWith('/admin')) return;
    if (!isPageView && seconds < 1) return;

    const projectId = extractProjectId(page);
    const blogId = extractBlogId(page);
    const source = getSource();

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page,
          projectId,
          blogId,
          source,
          seconds: Math.round(seconds),
        }),
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }, []);

  useEffect(() => {
    if (location.startsWith('/admin')) return;

    if (lastPageRef.current && lastPageRef.current !== location) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      sendAnalytics(lastPageRef.current, elapsed);
    }

    startTimeRef.current = Date.now();
    lastPageRef.current = location;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      if (elapsed >= 30) {
        sendAnalytics(location, elapsed);
        startTimeRef.current = Date.now();
      }
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [location, sendAnalytics]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      if (lastPageRef.current && elapsed >= 1) {
        navigator.sendBeacon('/api/analytics/track', JSON.stringify({
          page: lastPageRef.current,
          projectId: extractProjectId(lastPageRef.current),
          blogId: extractBlogId(lastPageRef.current),
          source: getSource(),
          seconds: Math.round(elapsed),
        }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const trackPageView = useCallback((page: string) => {
    sendAnalytics(page, 1, true);
  }, [sendAnalytics]);

  return { trackPageView };
}
