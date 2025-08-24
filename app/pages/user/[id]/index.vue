<!-- pages/products/[id].vue -->
<template>
    <div>
        <h1>Détails de l'utilisateur: {{ userId }}</h1>
        <p>Ceci est la page pour le produit avec l'ID: {{ userId }}</p>
        <!-- Ici, vous feriez généralement un appel API pour récupérer les détails
        du produit -->
    </div>
</template>
<script setup>
    import { useRoute } from 'vue-router';
    const route = useRoute();
    const userId = route.params.id;
</script>
<style scoped>
    h1 {
        color: #007bff;
    }
</style>
