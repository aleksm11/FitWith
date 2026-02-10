"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { getMyProfile } from "@/lib/supabase/queries";

const SWIPE_THRESHOLD = 60;

export default function SwipePortalWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = useLocale();
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigating = useRef(false);

  useEffect(() => {
    getMyProfile().then((p) => {
      if (p?.role === "admin") setIsAdmin(true);
    });
  }, []);

  // Reset navigating flag on pathname change
  useEffect(() => {
    navigating.current = false;
  }, [pathname]);

  // Build ordered tab paths based on role (only user-facing tabs for swipe)
  const tabs = [
    `/${locale}/portal`,
    `/${locale}/portal/trening`,
    `/${locale}/portal/ishrana`,
    `/${locale}/portal/profil`,
    ...(isAdmin ? [`/${locale}/portal/klijenti`] : []),
  ];

  const getCurrentIndex = useCallback(() => {
    return tabs.findIndex((t) =>
      t === `/${locale}/portal` ? pathname === t : pathname.startsWith(t)
    );
  }, [tabs, pathname, locale]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!touchStart.current || navigating.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStart.current.x;
      const dy = touch.clientY - touchStart.current.y;
      touchStart.current = null;

      // Only horizontal swipes (ignore vertical scrolling)
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dy) > Math.abs(dx)) return;

      const idx = getCurrentIndex();
      if (idx === -1) return;

      if (dx < 0 && idx < tabs.length - 1) {
        navigating.current = true;
        window.location.href = tabs[idx + 1];
      } else if (dx > 0 && idx > 0) {
        navigating.current = true;
        window.location.href = tabs[idx - 1];
      }
    },
    [getCurrentIndex, tabs]
  );

  useEffect(() => {
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return <>{children}</>;
}
