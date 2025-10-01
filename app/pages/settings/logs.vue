<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'
import { h, onUnmounted, ref } from 'vue'
import type { AppLog } from '~/utils/local-database'

const search = ref('')

definePageMeta({
  requiresAuth: false,
  layout: false,
})

const data = ref<AppLog[]>([])

const subscription = localDatabase.liveLogs().subscribe((logs: AppLog[]) => {
  data.value = logs
})

onUnmounted(() => {
  if (subscription) subscription.unsubscribe()
})

const columns: ColumnDef<AppLog>[] = [
  {
    accessorKey: 'autoId',
    header: '#',
    meta: {
      class: {
        th: 'text-left',
        td: 'text-left',
      },
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created Date',
    cell: ({ row }) => {
      const val = row.getValue('created_at')
      return val ? new Date(val as string).toLocaleString() : ''
    },
    meta: {
      class: {
        th: 'text-left',
        td: 'text-left',
      },
    },
  },
  {
    accessorKey: 'log_level',
    header: 'Level',
    cell: ({ row }) => {
      const level = row.getValue('log_level') as string
      const colorMap = {
        Debug: 'text-purple-400',
        Info: 'text-blue-400',
        Warn: 'text-orange-400',
        Error: 'text-red-400',
      }
      return h(
        'span',
        {
          class: `font-semibold ${colorMap[level as keyof typeof colorMap]}`,
        },
        level,
      )
    },
    meta: {
      class: {
        th: 'text-left',
        td: 'text-left',
      },
    },
  },
  {
    accessorKey: 'label',
    header: 'Label',
    meta: {
      class: {
        th: 'text-left',
        td: 'text-left',
      },
    },
  },
  {
    accessorKey: 'details',
    header: 'Details',
    cell: ({ row }) => {
      const details = row.getValue('details')
      return details ? JSON.stringify(details, null, 2) : ''
    },
    meta: {
      class: {
        th: 'text-left',
        td: 'text-left font-mono text-xs',
      },
    },
  },
]
</script>

<template>
  <div>
    <div
      class="sticky top-0 z-10 bg-[var(--ui-bg)] border-b border-gray-700 flex items-center justify-between w-full p-4"
    >
      <NuxtLink to="/">
        <div class="text-2xl font-bold">Logs</div>
      </NuxtLink>

      <UInput v-model="search" placeholder="Search" class="flex-grow max-w-md mx-4" size="lg" />

      <UButton
        variant="ghost"
        color="neutral"
        icon="i-lucide-x"
        to="/settings"
        class="p-0"
        size="xl"
      />
    </div>

    <UMain>
      <UTable v-model:global-filter="search" sticky :data="data" :columns="columns" />
    </UMain>
  </div>
</template>
