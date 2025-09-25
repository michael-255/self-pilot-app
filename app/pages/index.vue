<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('index').first())

const title = 'Tools and apps for every day'
const description = ''

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

/*
      color: neutral
      variant: subtle
*/

const links = [
  {
    label: 'Tools',
    icon: 'i-lucide-wrench',
    trailing: true,
    to: '/docs',
    size: 'xl' as const,
    color: 'primary' as const,
    variant: 'solid' as const
  },
  {
    label: 'Fitness',
    icon: 'i-lucide-dumbbell',
    trailing: true,
    to: '/',
    size: 'xl' as const,
    color: 'secondary' as const,
    variant: 'link' as const
  },
  {
    label: 'Journal',
    icon: 'i-lucide-book-open',
    trailing: true,
    to: '/',
    size: 'xl' as const,
    color: 'success' as const,
    variant: 'ghost' as const
  },
  {
    label: 'Budget',
    icon: 'i-lucide-dollar-sign',
    trailing: true,
    to: '/',
    size: 'xl' as const,
    color: 'error' as const,
    variant: 'outline' as const
  }
]
</script>

<template>
  <div v-if="page">
    <UPageHero
      :title="title"
      :description="description"
      :links="links"
    >
      <template #top>
        <HeroBackground />
        <LazyStarsBg />
      </template>

      <template #title>
        <MDC
          :value="title"
          unwrap="p"
        />
      </template>
    </UPageHero>

    <!-- <UPageSection
      v-for="(section, index) in page.sections"
      :key="index"
      :title="section.title"
      :description="section.description"
      :orientation="section.orientation"
      :reverse="section.reverse"
      :features="section.features"
    >
      <ImagePlaceholder />
    </UPageSection>

    <UPageSection
      :title="page.features.title"
      :description="page.features.description"
    >
      <UPageGrid>
        <UPageCard
          v-for="(item, index) in page.features.items"
          :key="index"
          v-bind="item"
          spotlight
        />
      </UPageGrid>
    </UPageSection> -->

    <!-- <UPageSection
      id="testimonials"
      :headline="page.testimonials.headline"
      :title="page.testimonials.title"
      :description="page.testimonials.description"
    >
      <UPageColumns class="xl:columns-4">
        <UPageCard
          v-for="(testimonial, index) in page.testimonials.items"
          :key="index"
          variant="subtle"
          :description="testimonial.quote"
          :ui="{ description: 'before:content-[open-quote] after:content-[close-quote]' }"
        >
          <template #footer>
            <UUser
              v-bind="testimonial.user"
              size="lg"
            />
          </template>
        </UPageCard>
      </UPageColumns>
    </UPageSection> -->

    <!-- <USeparator />

    <UPageCTA
      v-bind="page.cta"
      variant="naked"
      class="overflow-hidden"
    >
      <LazyStarsBg />
    </UPageCTA> -->
  </div>
</template>
