<template>
  <div>
    <!-- Need a custom title and a back button (support redirect) -->
    <AppHeader />

    <!-- Not sure if I need UMain -->
    <UMain>
      <slot />
    </UMain>
  </div>
</template>
