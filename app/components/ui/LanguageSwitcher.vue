<script setup lang="ts">
const { $i18n } = useNuxtApp();

const items = computed(() =>
  ($i18n.locales.value as Array<{ code: string; name: string }>).map((l) => ({
    label: l.name,
    value: l.code,
  }))
);

function onChange(value: string) {
  $i18n.setLocale(value as "en" | "km");
}
</script>

<template>
  <USelect
    :model-value="$i18n.locale.value"
    :items="items"
    size="xs"
    class="w-24"
    @update:model-value="onChange"
  />
</template>
