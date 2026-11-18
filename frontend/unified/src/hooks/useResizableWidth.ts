/*
  From: https://github.com/DiamondLightSource/xrpddatavis
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { usePersistentState } from "./usePersistentState";

const clamp = (value: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, value));

/**
 * A panel width that can be dragged from a handle on its trailing edge (or
 * resized with the arrow keys when the handle has focus), clamped and
 * persisted per browser.
 */
export function useResizableWidth(
  defaultWidth: number,
  min: number,
  max: number
) {
  const [width, setWidth] = usePersistentState("sidebarWidth", defaultWidth);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const applyClamped = useCallback(
    (raw: number) =>
      setWidth(clamp(raw, min, Math.min(max, window.innerWidth - 240))),
    [min, max, setWidth]
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    applyClamped(event.clientX - rect.left);
  };

  const onPointerUp = () => setDragging(false);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 60 : 20;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      applyClamped(width - step);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      applyClamped(width + step);
    }
  };

  // keep the panel from overflowing if the window is resized narrower
  useEffect(() => {
    const onResize = () => applyClamped(width);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    width,
    containerRef,
    dragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onKeyDown,
  };
}
