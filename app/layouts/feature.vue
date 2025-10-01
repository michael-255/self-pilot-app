<script setup lang="ts">
/*
Feature layout that provides a header with a title and a return button.
*/

const route = useRoute()

const title = ref(String(route.meta.featureTitle))
const titleTo = ref(String(route.meta.featureTitleTo))
const buttonTo = ref(String(route.meta.featureButtonTo))
const buttonLabel = ref(String(route.meta.featureButtonLabel))

watch(
  () => route.meta.featureTitle,
  (newFeatureTitle) => {
    title.value = String(newFeatureTitle)
  },
)

watch(
  () => route.meta.featureTitleTo,
  (newTitleReturnTo) => {
    titleTo.value = String(newTitleReturnTo)
  },
)

watch(
  () => route.meta.featureButtonTo,
  (newReturnTo) => {
    buttonTo.value = String(newReturnTo)
  },
)

watch(
  () => route.meta.featureButtonLabel,
  (newReturnLabel) => {
    buttonLabel.value = String(newReturnLabel)
  },
)
</script>

<template>
  <div>
    <UHeader :toggle="false">
      <template #left>
        <NuxtLink :to="titleTo">
          <div class="text-2xl font-bold">{{ title }}</div>
        </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />

        <UButton
          :label="buttonLabel"
          variant="outline"
          color="neutral"
          icon="i-lucide-chevron-left"
          :to="buttonTo"
        />
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>
  </div>
</template>
