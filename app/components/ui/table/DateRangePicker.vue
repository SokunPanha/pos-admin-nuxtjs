<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'

const modelValue = defineModel<{ start: CalendarDate; end: CalendarDate }>()
const { t } = useI18n()
const open = ref(false)

const formatDate = (d: CalendarDate) => {
  const [year, month, day] = String(d).slice(0, 10).split('-')
  return `${day}-${month}-${year}`
}

const displayValue = computed(() => {
  if (!modelValue.value?.start || !modelValue.value?.end) return ''
  return `${formatDate(modelValue.value.start)} - ${formatDate(modelValue.value.end)}`
})

function clear() {
  modelValue.value = undefined
  open.value = false
}
</script>

<template>
  <UPopover v-model:open="open">
    <UInput
      :model-value="displayValue"
      :placeholder="$t('placeholder.selectDateRange')"
      readonly
      class="cursor-pointer w-full"
    >
      <template #trailing>
        <UButton
          v-if="modelValue"
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-heroicons-x-mark"
          class="px-0"
          @click.stop="clear"
        />
        <UIcon v-else name="i-lucide-calendar" class="text-muted-foreground" />
      </template>
    </UInput>

    <template #content>
      <UCalendar v-model="modelValue" class="p-2" :number-of-months="2" range />
    </template>
  </UPopover>
</template>
