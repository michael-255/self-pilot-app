<script setup lang="ts">
const route = useRoute()

const title = ref(String(route.meta.featureTitle))
const returnTo = ref(String(route.meta.featureReturnTo))
const returnLabel = ref(String(route.meta.featureReturnLabel))

watch(
  () => route.meta.featureTitle,
  (newFeatureTitle) => {
    title.value = String(newFeatureTitle)
  },
)

watch(
  () => route.meta.featureReturnTo,
  (newReturnTo) => {
    returnTo.value = String(newReturnTo)
  },
)

watch(
  () => route.meta.featureReturnLabel,
  (newReturnLabel) => {
    returnLabel.value = String(newReturnLabel)
  },
)
</script>

<template>
  <div>
    <UHeader :toggle="false">
      <template #left>
        <NuxtLink to="/">
          <div class="text-2xl font-bold">{{ title }}</div>
        </NuxtLink>
      </template>

      <template #right>
        <UButton
          :label="returnLabel"
          variant="outline"
          color="neutral"
          icon="i-lucide-chevron-left"
          :to="returnTo"
        />
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>
  </div>
</template>
