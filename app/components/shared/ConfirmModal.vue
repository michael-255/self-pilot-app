<script setup lang="ts">
import { ref } from 'vue'
const props = withDefaults(
  defineProps<{
    title: string
    description: string
    label?: string
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
    unlock?: boolean
    onConfirm: () => Promise<void>
  }>(),
  {
    label: 'Confirm',
    color: 'primary',
    unlock: false,
  },
)

const isUnlocked = ref(!props.unlock)
</script>

<template>
  <UModal :open="true" :title :ui="{ footer: 'justify-end' }">
    <template #description>
      <div class="mt-6">
        {{ description }}
      </div>

      <div v-if="props.unlock" class="mt-6 mb-3">
        <USwitch
          v-model="isUnlocked"
          label="Unlock Required"
          :color="color"
          size="xl"
          checked-icon="i-lucide-lock-open"
          unchecked-icon="i-lucide-lock"
          :ui="{ icon: 'w-3 h-3' }"
        />
      </div>
    </template>

    <template #footer="{ close }">
      <UButton
        :label
        :color
        :disabled="!isUnlocked"
        @click="
          async () => {
            await onConfirm()
            close()
          }
        "
      />
    </template>
  </UModal>
</template>
