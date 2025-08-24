<template>
    <div>
        <h1>User Profile</h1>
        <p>Name: {{ user.name }}</p>
        <p>Email: {{ user.email }}</p>
    </div>
</template>
<script setup>
    import { useRoute } from 'vue-router';
    import { ref, onMounted } from 'vue';

    const route = useRoute();
    const userId = route.params.id;
    const user = ref({ name: '', email: '' });

    onMounted(() => {
        // Simuler un appel API pour récupérer les détails de l'utilisateur
        // Remplacez ceci par un vrai appel API
        user.value = {
            name: 'User ' + userId,
            email: 'user' + userId + '@example.com'
        };
    });
</script>
<style scoped>
    h1 {
        color: #28a745;
    }
    p {
        font-size: 16px;
    }
</style>