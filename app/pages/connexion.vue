<template>
  <div>
    <h1>{{ $t('login_title') }}</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">{{ $t('email') }}</label>
        <input type="email" v-model="credentials.email" required />
      </div>
      <div>
        <label for="password">{{ $t('password') }}</label>
        <input type="password" v-model="credentials.password" required />
      </div>
      <p v-if="error">{{ error }}</p>
      <button type="submit">{{ $t('login_button') }}</button>
    </form>
  </div>
</template>

<script setup lang="ts">
const { signIn } = useAuth()
const { t } = useI18n()

definePageMeta({ auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' } })

const credentials = ref({ email: 'doumbouyaibrahima@gmail.com', password: '89Mamankoul$$' })
const error = ref<string | null>(null)

const handleLogin = async () => {
  try {
    await signIn(credentials.value, { callbackUrl: '/' })
  } catch (e) {
    error.value = "Échec de l'authentification. Vérifiez vos identifiants."
    console.error(e)
  }
}
</script>
