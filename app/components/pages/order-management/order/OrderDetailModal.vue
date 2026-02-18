<script setup lang="ts">

/* =======================
   Props & State
======================= */
const props = defineProps<{
  uuid: string | null
}>()

const open = defineModel<boolean>('open', { default: false })
const data = ref<OrderDetailResponseType | null>(null)

const { t, locale } = useI18n()
const { fetchOrderDetail } = useOrderManagement()

/* =======================
   Watch API Call
======================= */
watch(
  () => props.uuid,
  async (uuid) => {
    if (!uuid) return
    try {
      data.value = await fetchOrderDetail(uuid)
      console.log("🚀 ~ data.value:", data.value)
    } catch (err) {
      console.error('Failed to fetch order detail:', err)
    }
  },
  { immediate: true }
)

/* =======================
   Helpers
======================= */
const formatDate = (value?: string) => {
  if (!value) return '-'
  return new Date(value).toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const formatCurrency = (value?: string | number) => {
  const amount = Number(value || 0)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const subtotal = computed(() => {
  return (
    data.value?.items?.reduce(
      (sum, item) => sum + Number(item.totalPrice),
      0
    ) ?? 0
  )
})
</script>

<template>
  <UModal v-model:open="open" size="xl">
    <template #content>
    <UCard v-if="data">
      <!-- =======================
           Header
      ======================== -->
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold">
            {{ t('label.orderDetail') }} #{{ data.orderId }}
          </h3>
          <UButton
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            @click="open = false"
          />
        </div>
      </template>

      <div class="space-y-6">
        <!-- =======================
             Order Info
        ======================== -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span class="block text-sm text-gray-500">
              {{ t('label.date') }}
            </span>
            <span class="font-medium">
              {{ formatDate(data.createdAt) }}
            </span>
          </div>

          <div>
            <span class="block text-sm text-gray-500">
              {{ t('label.cashier') }}
            </span>
            <span class="font-medium">
              {{ data.cashier.fullName }}
            </span>
          </div>

          <div>
            <span class="block text-sm text-gray-500">
              {{ t('label.status') }}
            </span>
            <UBadge :color="data.status === 'Paid' ? 'success' : 'warning'">
              {{ data.status }}
            </UBadge>
          </div>
        </div>

        <!-- =======================
             Items Table
        ======================== -->
        <div>
          <h4 class="font-semibold mb-2">
            {{ t('label.products') }}
          </h4>

          <div class="border rounded-md overflow-hidden">
            <table class="w-full text-sm text-left">
              <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500">
                <tr>
                  <th class="px-4 py-2">
                    {{ t('label.product') }}
                  </th>
                  <th class="px-4 py-2 text-right">
                    {{ t('label.price') }}
                  </th>
                  <th class="px-4 py-2 text-right">
                    {{ t('label.quantity') }}
                  </th>
                  <th class="px-4 py-2 text-right">
                    {{ t('label.total') }}
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y dark:divide-gray-700">
                <tr v-for="item in data.items" :key="item.id">
                  <td class="px-4 py-2">
                    <div class="font-medium">
                      {{ item.productName[locale] ?? item.productName.en }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ item.variantName[locale] ?? item.variantName.en }}
                    </div>
                  </td>

                  <td class="px-4 py-2 text-right">
                    {{ formatCurrency(item.unitPrice) }}
                  </td>

                  <td class="px-4 py-2 text-right">
                    {{ item.quantity }}
                  </td>

                  <td class="px-4 py-2 text-right">
                    {{ formatCurrency(item.totalPrice) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- =======================
             Summary
        ======================== -->
        <div class="flex justify-end">
          <div class="w-64 space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-500">
                {{ t('label.subtotal') }}
              </span>
              <span>{{ formatCurrency(subtotal) }}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-500">
                {{ t('label.discount') }}
              </span>
              <span>-{{ formatCurrency(data.discount) }}</span>
            </div>

            <div class="flex justify-between text-lg font-bold border-t pt-2">
              <span>{{ t('label.total') }}</span>
              <span>{{ formatCurrency(data.totalAmount) }}</span>
            </div>
          </div>
        </div>
      </div>
    </UCard>
    </template>
  </UModal>
</template>
