<script setup lang="ts">
const title = 'Pricing'
const description = 'Simple and transparent pricing for individuals and teams.'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImageComponent('Saas')

const isYearly = ref('0')

const items = ref([
  {
    label: 'Monthly',
    value: '0'
  },
  {
    label: 'Yearly',
    value: '1'
  }
])
</script>

<template>
  <div>PRICING</div>
</template>
