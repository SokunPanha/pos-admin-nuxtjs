<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    max?: number;
  }>(),
  { max: 1 }
);

const model = defineModel<string[]>({ default: () => [] });

const { t } = useI18n();
const toast = useToast();
const { uploadImage } = useMediaUpload();

const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const dragging = ref(false);

function openFilePicker() {
  fileInput.value?.click();
}

async function handleFiles(files: FileList | null) {
  if (!files || files.length === 0) return;

  const remaining = props.max - model.value.length;
  if (remaining <= 0) return;

  const filesToUpload = Array.from(files).slice(0, remaining);

  uploading.value = true;
  try {
    const urls = await Promise.all(filesToUpload.map((f) => uploadImage(f)));
    model.value = [...model.value, ...urls];
  } catch {
    toast.add({ title: t("message.operationFailed"), color: "error" });
  } finally {
    uploading.value = false;
    if (fileInput.value) fileInput.value.value = "";
  }
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  handleFiles(input.files);
}

function onDrop(e: DragEvent) {
  dragging.value = false;
  handleFiles(e.dataTransfer?.files ?? null);
}

function removeImage(index: number) {
  model.value = model.value.filter((_, i) => i !== index);
}
</script>

<template>
  <div class="space-y-3">
    <!-- Preview grid -->
    <div v-if="model.length > 0" class="flex flex-wrap gap-3">
      <div
        v-for="(url, index) in model"
        :key="url"
        class="group relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <img
          :src="url"
          :alt="`Image ${index + 1}`"
          class="h-full w-full object-cover"
        />
        <button
          type="button"
          class="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
          @click="removeImage(index)"
        >
          <UIcon name="i-lucide-x" class="h-3 w-3" />
        </button>
      </div>
    </div>

    <!-- Drop zone -->
    <div
      v-if="model.length < max"
      class="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 transition-colors"
      :class="
        dragging
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
          : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
      "
      @click="openFilePicker"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <UIcon
        v-if="!uploading"
        name="i-lucide-upload"
        class="mb-2 h-8 w-8 text-gray-400"
      />
      <UIcon
        v-else
        name="i-lucide-loader-2"
        class="mb-2 h-8 w-8 animate-spin text-gray-400"
      />
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ uploading ? t("label.uploading") : t("label.dragOrClick") }}
      </p>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      :multiple="max > 1"
      class="hidden"
      @change="onFileChange"
    />
  </div>
</template>
