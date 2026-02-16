<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'

const modelValue = defineModel<CalendarDate>()

const inputDate = useTemplateRef('inputDate')
</script>

<template>
  <UInputDate ref="inputDate" v-model="modelValue">
    <template #trailing>
      <UPopover :reference="inputDate?.inputsRef[3]?.$el">
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          icon="i-lucide-calendar"
          aria-label="Select a date"
          class="px-0"
        />

        <template #content>
          <UCalendar v-model="modelValue" class="p-2" />
        </template>
      </UPopover>
    </template>
  </UInputDate>
</template>
