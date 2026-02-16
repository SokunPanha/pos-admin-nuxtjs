import { ref, computed } from "vue";

export function useTableFullscreen() {
  const isFullscreen = ref(false);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value;

    // Prevent body scroll when in fullscreen
    if (typeof document !== "undefined") {
      if (isFullscreen.value) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
  };

  // Enter fullscreen
  const enterFullscreen = () => {
    isFullscreen.value = true;
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  };

  // Exit fullscreen
  const exitFullscreen = () => {
    isFullscreen.value = false;
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
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
