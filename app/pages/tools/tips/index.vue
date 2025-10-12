<script setup lang="ts">
import { computed, ref } from 'vue'
import z from 'zod'

const bill = ref<number | string>(1)
const tip = ref<number | string>(20)
const people = ref<number | string>(1)

const schema = z.object({
  bill: z.number().min(1),
  tip: z.number().min(0).max(100),
  people: z.number().int().min(1),
})

/**
 * Auto-correct inputs to be within valid ranges if they are not undefined, null, or empty string.
 */
const autoCorrect = () => {
  // Only correct if value is not undefined, null, or empty string
  if (bill.value !== undefined && bill.value !== null && bill.value !== '') {
    bill.value = Math.max(1, Number(bill.value))
  }
  if (tip.value !== undefined && tip.value !== null && tip.value !== '') {
    tip.value = Math.min(100, Math.max(0, Number(tip.value)))
  }
  if (people.value !== undefined && people.value !== null && people.value !== '') {
    people.value = Math.max(1, Math.round(Number(people.value)))
  }
}

watch([bill, tip, people], autoCorrect)

const parsed = computed(() => {
  // Only parse if all are defined and not empty
  if (!bill.value || !tip.value || !people.value) {
    return null
  }

  const result = schema.safeParse({
    bill: bill.value,
    tip: tip.value,
    people: people.value,
  })

  return result.success ? result.data : null
})

const totalTip = computed(() => {
  if (!parsed.value) return 0
  return (parsed.value.bill * parsed.value.tip) / 100
})

const totalBill = computed(() => {
  if (!parsed.value) return 0
  return parsed.value.bill + totalTip.value
})

const perPerson = computed(() => {
  if (!parsed.value) return 0
  return totalBill.value / parsed.value.people
})

const showResult = computed(() => !!parsed.value)

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
</script>

<template>
  <UPage>
    <UContainer class="pb-16 space-y-4">
      <UPageHeader title="Tip Calculator" class="mb-9" />

      <UForm class="space-y-4">
        <UFormField label="Bill Amount">
          <UInput
            v-model.number="bill"
            type="number"
            min="1"
            step="0.01"
            size="xl"
            placeholder="Enter bill amount"
            icon="i-lucide-dollar-sign"
            class="w-full sm:w-64"
          />
        </UFormField>

        <UFormField label="Tip %">
          <UInput
            v-model.number="tip"
            type="number"
            min="0"
            max="100"
            step="0.01"
            size="xl"
            placeholder="Enter tip percentage"
            icon="i-lucide-percent"
            class="w-full sm:w-32"
          />
        </UFormField>

        <UFormField label="Number of People">
          <UInput
            v-model.number="people"
            type="number"
            min="1"
            step="1"
            size="xl"
            placeholder="Enter number of people"
            icon="i-lucide-users"
            class="w-full sm:w-32"
          />
        </UFormField>
      </UForm>

      <UCard v-if="showResult" variant="soft">
        <div class="flex justify-between">
          <div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Total Tip</div>
            <div class="text-lg">{{ currencyFormatter.format(totalTip) }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Total Bill</div>
            <div class="text-lg">{{ currencyFormatter.format(totalBill) }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Each Pays</div>
            <div class="text-lg">{{ currencyFormatter.format(perPerson) }}</div>
          </div>
        </div>
      </UCard>

      <UAlert v-else color="warning" variant="soft" icon="i-lucide-triangle-alert">
        <template #title>Valid Inputs Required</template>
      </UAlert>
    </UContainer>
  </UPage>
</template>
