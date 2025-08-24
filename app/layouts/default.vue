<template>
  <div>
    <AppHeader />
    <nav>
      <ul>
        <li><NuxtLink to='/'>Accueil</NuxtLink></li>
        <li><NuxtLink to='/contact'>Contact</NuxtLink></li>
        <li><NuxtLink to='/products/456'>Produit 456</NuxtLink></li>
      </ul>
    </nav>
    <h1>Default layout</h1>
    <slot />
    <AppFooter />
  </div>
</template>
<script setup>
</script>
<style scoped>
  div {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
</style>