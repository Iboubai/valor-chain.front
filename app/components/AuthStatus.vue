<template>
  <div>
    <div v-if="status === 'authenticated'">
      <p>Connecté en tant que {{ data?.user?.name }}</p>
      <button @click="signOut()">Se déconnecter</button>
    </div>
    <div v-else>
      <p>Vous n'êtes pas connecté.</p>
      <NuxtLink to="/connexion">Se connecter</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { status, data, signOut } = useAuth()
</script>
