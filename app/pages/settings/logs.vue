<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'

interface Payment {
  id: string
  date: string
  status: 'paid' | 'failed' | 'refunded'
  email: string
  amount: number
}

const data: Payment[] = [
  {
    id: '4600',
    date: '2024-03-11T15:30:00',
    status: 'paid',
    email: 'james.anderson@example.com',
    amount: 594,
  },
  {
    id: '4599',
    date: '2024-03-11T10:10:00',
    status: 'failed',
    email: 'mia.white@example.com',
    amount: 276,
  },
  {
    id: '4598',
    date: '2024-03-11T08:50:00',
    status: 'refunded',
    email: 'william.brown@example.com',
    amount: 315,
  },
  {
    id: '4597',
    date: '2024-03-10T19:45:00',
    status: 'paid',
    email: 'emma.davis@example.com',
    amount: 529,
  },
  {
    id: '4596',
    date: '2024-03-10T15:55:00',
    status: 'paid',
    email: 'ethan.harris@example.com',
    amount: 639,
  },
  { id: '4595', date: '2024-03-10T12:20:00', status: 'failed', email: 'a@a.com', amount: 199 },
  { id: '4594', date: '2024-03-10T09:30:00', status: 'paid', email: 'b@b.com', amount: 450 },
  {
    id: '4593',
    date: '2024-03-09T18:10:00',
    status: 'paid',
    email: 'olivia.martin@example.com',
    amount: 512,
  },
  {
    id: '4592',
    date: '2024-03-09T14:05:00',
    status: 'refunded',
    email: 'lucas.thomas@example.com',
    amount: 320,
  },
  {
    id: '4591',
    date: '2024-03-09T11:30:00',
    status: 'failed',
    email: 'sophia.moore@example.com',
    amount: 210,
  },
  {
    id: '4590',
    date: '2024-03-09T08:45:00',
    status: 'paid',
    email: 'benjamin.jackson@example.com',
    amount: 480,
  },
  {
    id: '4589',
    date: '2024-03-08T20:20:00',
    status: 'paid',
    email: 'ava.lee@example.com',
    amount: 599,
  },
  {
    id: '4588',
    date: '2024-03-08T16:40:00',
    status: 'refunded',
    email: 'logan.walker@example.com',
    amount: 305,
  },
  {
    id: '4587',
    date: '2024-03-08T13:15:00',
    status: 'paid',
    email: 'isabella.hall@example.com',
    amount: 550,
  },
  {
    id: '4586',
    date: '2024-03-08T09:50:00',
    status: 'failed',
    email: 'mason.young@example.com',
    amount: 180,
  },
  {
    id: '4585',
    date: '2024-03-07T19:30:00',
    status: 'paid',
    email: 'mia.king@example.com',
    amount: 620,
  },
  {
    id: '4584',
    date: '2024-03-07T15:10:00',
    status: 'paid',
    email: 'elijah.wright@example.com',
    amount: 470,
  },
  {
    id: '4583',
    date: '2024-03-07T12:25:00',
    status: 'refunded',
    email: 'charlotte.scott@example.com',
    amount: 295,
  },
  {
    id: '4582',
    date: '2024-03-07T08:40:00',
    status: 'failed',
    email: 'jackson.green@example.com',
    amount: 220,
  },
  {
    id: '4581',
    date: '2024-03-06T18:55:00',
    status: 'paid',
    email: 'amelia.adams@example.com',
    amount: 510,
  },
  {
    id: '4580',
    date: '2024-03-06T14:35:00',
    status: 'paid',
    email: 'henry.baker@example.com',
    amount: 630,
  },
  {
    id: '4579',
    date: '2024-03-06T11:20:00',
    status: 'refunded',
    email: 'ella.carter@example.com',
    amount: 340,
  },
  {
    id: '4578',
    date: '2024-03-06T08:05:00',
    status: 'failed',
    email: 'sebastian.mitchell@example.com',
    amount: 205,
  },
  {
    id: '4577',
    date: '2024-03-05T19:15:00',
    status: 'paid',
    email: 'grace.perez@example.com',
    amount: 590,
  },
  {
    id: '4576',
    date: '2024-03-05T15:00:00',
    status: 'paid',
    email: 'alexander.roberts@example.com',
    amount: 475,
  },
  {
    id: '4575',
    date: '2024-03-05T12:10:00',
    status: 'refunded',
    email: 'chloe.turner@example.com',
    amount: 325,
  },
  {
    id: '4574',
    date: '2024-03-05T08:30:00',
    status: 'failed',
    email: 'daniel.phillips@example.com',
    amount: 190,
  },
  {
    id: '4573',
    date: '2024-03-04T18:20:00',
    status: 'paid',
    email: 'zoe.campbell@example.com',
    amount: 540,
  },
  {
    id: '4572',
    date: '2024-03-04T14:10:00',
    status: 'paid',
    email: 'samuel.parker@example.com',
    amount: 610,
  },
  {
    id: '4571',
    date: '2024-03-04T11:05:00',
    status: 'refunded',
    email: 'lily.evans@example.com',
    amount: 315,
  },
  {
    id: '4570',
    date: '2024-03-04T08:00:00',
    status: 'failed',
    email: 'matthew.edwards@example.com',
    amount: 230,
  },
]

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: {
      class: {
        th: 'text-center font-semibold',
        td: 'text-center font-mono',
      },
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      return new Date(row.getValue('date')).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: {
      class: {
        th: 'text-center',
        td: 'text-center',
      },
    },
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const colorMap = {
        paid: 'text-success',
        failed: 'text-error',
        refunded: 'text-warning',
      }
      return h(
        'span',
        {
          class: `font-semibold capitalize ${colorMap[status as keyof typeof colorMap]}`,
        },
        status,
      )
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    meta: {
      class: {
        th: 'text-left',
        td: 'text-left',
      },
    },
  },
  {
    accessorKey: 'amount',
    meta: {
      class: {
        th: 'text-right font-bold text-primary',
        td: 'text-right font-mono',
      },
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)

      return h(
        'span',
        {
          class: 'font-semibold text-success',
        },
        formatted,
      )
    },
    header: () => h('div', { class: 'text-right font-medium' }, 'Amount'),
    footer: () => {
      return h('div', { class: 'text-right font-medium' }, `Footer`)
    },
  },
]
</script>

<template>
  <UTable sticky :data="data" :columns="columns" class="h-screen w-screen max-h-screen" />
</template>
