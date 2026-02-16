import { ref, computed, watch } from "vue";

export type DensityType = "compact" | "default" | "comfortable";

const STORAGE_KEY = "pro-table-density-";

interface DensityConfig {
  cell: string;
  header: string;
  label: string;
}

const densityConfigs: Record<DensityType, DensityConfig> = {
  compact: {
    cell: "py-1.5 px-2 text-sm",
    header: "py-2 px-2 text-sm",
    label: "Compact",
  },
  default: {
    cell: "py-2 px-3",
    header: "py-2.5 px-3",
    label: "Default",
  },
  comfortable: {
    cell: "py-3 px-4",
    header: "py-3.5 px-4",
    label: "Comfortable",
  },
};

export function useTableDensity(
  defaultDensity: DensityType = "default",
  tableId?: string, // Unique ID for localStorage
) {
  const density = ref<DensityType>(defaultDensity);

  // Load from localStorage
  const loadDensity = () => {
    if (tableId && typeof window !== "undefined") {
      const stored = localStorage.getItem(`${STORAGE_KEY}${tableId}`);
      if (stored && (stored === "compact" || stored === "default" || stored === "comfortable")) {
        density.value = stored as DensityType;
      }
    }
  };

  // Save to localStorage
  const saveDensity = () => {
    if (tableId && typeof window !== "undefined") {
      localStorage.setItem(`${STORAGE_KEY}${tableId}`, density.value);
    }
  };

  // Watch for changes
  watch(density, () => {
    saveDensity();
  });

  // Set density
  const setDensity = (newDensity: DensityType) => {
    density.value = newDensity;
  };

  // Cycle through densities
  const cycleDensity = () => {
    const densities: DensityType[] = ["compact", "default", "comfortable"];
    const currentIndex = densities.indexOf(density.value);
    const nextIndex = (currentIndex + 1) % densities.length;
    density.value = densities[nextIndex]!;
  };

  // Get cell classes
  const cellClasses = computed(() => densityConfigs[density.value].cell);

  // Get header classes
  const headerClasses = computed(() => densityConfigs[density.value].header);

  // Get current density config
  const currentConfig = computed(() => densityConfigs[density.value]);

  // Get all density options (for UI)
  const densityOptions = computed(() => {
    return Object.entries(densityConfigs).map(([key, config]) => ({
      value: key as DensityType,
      label: config.label,
      active: density.value === key,
    }));
  });

  // Initialize
  loadDensity();

  return {
    density,
    setDensity,
    cycleDensity,
    cellClasses,
    headerClasses,
    currentConfig,
    densityOptions,
  };
}
