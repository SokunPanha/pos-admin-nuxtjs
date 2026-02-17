import { ref, computed } from "vue";
import { useState } from "#imports";

export function useTableFullscreen() {
  const isFullscreen = ref(false);
  const globalFullscreen = useState("tableFullscreen", () => false);

  const syncBodyAndGlobal = () => {
    globalFullscreen.value = isFullscreen.value;
    if (typeof document !== "undefined") {
      document.body.style.overflow = isFullscreen.value ? "hidden" : "";
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value;
    syncBodyAndGlobal();
  };

  // Enter fullscreen
  const enterFullscreen = () => {
    isFullscreen.value = true;
    syncBodyAndGlobal();
  };

  // Exit fullscreen
  const exitFullscreen = () => {
    isFullscreen.value = false;
    syncBodyAndGlobal();
  };

  // Container classes for fullscreen overlay
  const containerClasses = computed(() => {
    if (isFullscreen.value) {
      return "fixed inset-0 z-50 bg-background overflow-hidden";
    }
    return "";
  });

  // Icon for fullscreen button
  const fullscreenIcon = computed(() => {
    return isFullscreen.value
      ? "i-heroicons-arrows-pointing-in"
      : "i-heroicons-arrows-pointing-out";
  });

  // Tooltip text
  const fullscreenTooltip = computed(() => {
    return isFullscreen.value ? "Exit Fullscreen" : "Fullscreen";
  });

  return {
    isFullscreen,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
    containerClasses,
    fullscreenIcon,
    fullscreenTooltip,
  };
}
