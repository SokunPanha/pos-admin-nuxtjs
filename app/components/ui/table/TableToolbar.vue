<script setup lang="ts">
import type { DensityType, ToolbarOptions } from "./type";
import type { ProTableColumn } from "./useTableColumns";
import ColumnSettingsPopover from "./ColumnSettingsPopover.vue";

interface ColumnWithMeta {
  key: string;
  visible: boolean;
  title: string;
  hideInTable?: boolean;
  fixed?: boolean;
}

const props = withDefaults(
  defineProps<{
    options?: boolean | ToolbarOptions;
    // Reload
    onReload?: () => void;
    reloading?: boolean;
    // Export
    onExport?: () => void;
    exporting?: boolean;
    // Density
    density?: DensityType;
    densityOptions?: { value: DensityType; label: string; active: boolean }[];
    onDensityChange?: (density: DensityType) => void;
    // Column Settings
    columns?: ColumnWithMeta[];
    onColumnToggle?: (key: string) => void;
    onColumnReorder?: (newOrder: string[]) => void;
    onColumnsReset?: () => void;
    onShowAllColumns?: () => void;
    // Fullscreen
    isFullscreen?: boolean;
    fullscreenIcon?: string;
    fullscreenTooltip?: string;
    onToggleFullscreen?: () => void;
    // Selection info
    selectedCount?: number;
  }>(),
  {
    options: true,
    reloading: false,
    exporting: false,
    selectedCount: 0,
  }
);

// Parse options
const toolbarOptions = computed(() => {
  if (typeof props.options === "boolean") {
    return props.options
      ? {
          reload: true,
          export: true,
          density: true,
          columnSettings: true,
          fullscreen: true,
        }
      : {};
  }
  return props.options || {};
});

const showReload = computed(() => toolbarOptions.value.reload !== false);
const showExport = computed(() => toolbarOptions.value.export !== false);
const showDensity = computed(() => toolbarOptions.value.density !== false);
const showColumnSettings = computed(
  () => toolbarOptions.value.columnSettings !== false
);
const showFullscreen = computed(() => toolbarOptions.value.fullscreen !== false);

// Density dropdown open state
const densityOpen = ref(false);
</script>

<template>
  <div class="flex items-center justify-between px-4 py-2 border-b border-default">
    <!-- Left side - Info -->
    <div class="flex items-center gap-2">
      <slot name="toolbar-left">
        <div v-if="selectedCount > 0" class="text-sm text-muted-foreground">
          {{ selectedCount }} selected
        </div>
      </slot>
    </div>

    <!-- Right side - Actions -->
    <div class="flex items-center gap-1">
      <slot name="toolbar-actions" />

      <!-- Reload Button -->
      <UTooltip v-if="showReload && onReload" text="Reload">
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-heroicons-arrow-path"
          square
          class="h-9 w-9"
          :loading="reloading"
          @click="onReload"
        />
      </UTooltip>

      <!-- Export Button -->
      <UTooltip v-if="showExport && onExport" text="Export to CSV">
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-heroicons-arrow-down-tray"
          square
          class="h-9 w-9"
          :loading="exporting"
          @click="onExport"
        />
      </UTooltip>

      <!-- Density Selector -->
      <UPopover v-if="showDensity && densityOptions" v-model:open="densityOpen">
        <UTooltip text="Density">
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-heroicons-view-columns"
            square
            class="h-9 w-9"
          />
        </UTooltip>

        <template #content>
          <div class="w-40 p-2 space-y-1">
            <button
              v-for="option in densityOptions"
              :key="option.value"
              @click="
                () => {
                  onDensityChange?.(option.value);
                  densityOpen = false;
                }
              "
              :class="[
                'w-full text-left px-3 py-2 text-sm rounded-md transition-colors',
                'hover:bg-muted',
                option.active && 'bg-muted font-medium',
              ]"
            >
              {{ option.label }}
            </button>
          </div>
        </template>
      </UPopover>

      <!-- Column Settings -->
      <UTooltip v-if="showColumnSettings && columns" text="Column Settings">
        <ColumnSettingsPopover
          :columns="columns"
          :on-toggle="onColumnToggle!"
          :on-reorder="onColumnReorder!"
          :on-reset="onColumnsReset!"
          :on-show-all="onShowAllColumns!"
        />
      </UTooltip>

      <!-- Fullscreen Toggle -->
      <UTooltip
        v-if="showFullscreen && onToggleFullscreen"
        :text="fullscreenTooltip"
      >
        <UButton
          variant="ghost"
          color="neutral"
          :icon="fullscreenIcon"
          square
          class="h-9 w-9"
          @click="onToggleFullscreen"
        />
      </UTooltip>
    </div>
  </div>
</template>
