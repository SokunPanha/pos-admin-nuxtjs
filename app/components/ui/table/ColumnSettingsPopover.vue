<script setup lang="ts">
import { ref } from "vue";
import type { ProTableColumn } from "./useTableColumns";

interface ColumnWithMeta {
  key: string;
  visible: boolean;
  title: string;
  hideInTable?: boolean;
  fixed?: boolean;
}

const props = defineProps<{
  columns: ColumnWithMeta[];
  onToggle: (key: string) => void;
  onReorder: (newOrder: string[]) => void;
  onReset: () => void;
  onShowAll: () => void;
}>();

const open = ref(false);
const draggedIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);

// Local copy of columns for drag and drop
const localColumns = ref([...props.columns]);

// Handle drag start
const handleDragStart = (index: number) => {
  draggedIndex.value = index;
};

// Handle drag over
const handleDragOver = (event: DragEvent, index: number) => {
  event.preventDefault();
  dragOverIndex.value = index;
};

// Handle drop
const handleDrop = (event: DragEvent, dropIndex: number) => {
  event.preventDefault();

  if (draggedIndex.value === null) return;

  const newColumns = [...localColumns.value];
  const draggedItem = newColumns[draggedIndex.value];

  if (!draggedItem) return;

  // Remove dragged item
  newColumns.splice(draggedIndex.value, 1);
  // Insert at new position
  newColumns.splice(dropIndex, 0, draggedItem);

  localColumns.value = newColumns;

  // Update order
  const newOrder = newColumns.map((col) => col.key);
  props.onReorder(newOrder);

  draggedIndex.value = null;
  dragOverIndex.value = null;
};

// Handle drag end
const handleDragEnd = () => {
  draggedIndex.value = null;
  dragOverIndex.value = null;
};

// Watch columns prop to update local copy
watch(
  () => props.columns,
  (newColumns) => {
    localColumns.value = [...newColumns];
  },
  { deep: true }
);
</script>

<template>
  <UPopover v-model:open="open">
    <UButton
      variant="ghost"
      color="neutral"
      icon="i-heroicons-cog-6-tooth"
      square
      class="h-9 w-9"
    />

    <template #content>
      <div class="w-64 p-3 space-y-3">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold">Column Settings</h3>
          <div class="flex gap-1">
            <UButton
              size="xs"
              variant="ghost"
              color="neutral"
              @click="onShowAll"
            >
              Show All
            </UButton>
            <UButton
              size="xs"
              variant="ghost"
              color="neutral"
              @click="onReset"
            >
              Reset
            </UButton>
          </div>
        </div>

        <!-- Column List -->
        <div class="space-y-1 max-h-96 overflow-y-auto">
          <div
            v-for="(column, index) in localColumns"
            :key="column.key"
            :draggable="!column.fixed"
            @dragstart="handleDragStart(index)"
            @dragover="(e) => handleDragOver(e, index)"
            @drop="(e) => handleDrop(e, index)"
            @dragend="handleDragEnd"
            :class="[
              'flex items-center gap-2 p-2 rounded-md transition-colors',
              !column.fixed && 'cursor-move hover:bg-muted',
              draggedIndex === index && 'opacity-50',
              dragOverIndex === index && 'border-t-2 border-primary',
            ]"
          >
            <!-- Drag Handle -->
            <UIcon
              v-if="!column.fixed"
              name="i-heroicons-bars-3"
              class="w-4 h-4 text-muted-foreground"
            />
            <div v-else class="w-4"></div>

            <!-- Checkbox -->
            <UCheckbox
              :model-value="column.visible"
              @update:model-value="() => onToggle(column.key)"
              :disabled="column.fixed"
            />

            <!-- Column Title -->
            <span
              :class="[
                'text-sm flex-1',
                column.fixed && 'text-muted-foreground',
              ]"
            >
              {{ column.title }}
              <span v-if="column.fixed" class="text-xs ml-1">(Fixed)</span>
            </span>
          </div>
        </div>

        <!-- Footer Note -->
        <p class="text-xs text-muted-foreground">
          Drag to reorder columns
        </p>
      </div>
    </template>
  </UPopover>
</template>
