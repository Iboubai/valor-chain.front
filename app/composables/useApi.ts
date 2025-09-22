const { token } = useFrontAuth()

export function useApi() {
  const config = useRuntimeConfig() // lit les variables d'environnement NUXT_PUBLIC_*

  // Fonction GET
  const get = async <T>(endpoint: string): Promise<T> => {
    const data = await $fetch<T>(`${config.public.apiBase}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token.value}`
      }
    })
    return data
  }

  // Fonction POST
  const post = async <T>(endpoint: string, body: any): Promise<T> => {
    const data = await $fetch<T>(`${config.public.apiBase}${endpoint}`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token.value}`
      }
    })    
    return data
  }

  // Fonction POST
  const patch = async <T>(endpoint: string, body: any) => {
    await $fetch(`${config.public.apiBase}${endpoint}`, {
      method: 'PATCH',
      body, 
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token.value}`
      }
    })
  }

  // Idem pour PUT, DELETE si besoin…
  return { get, post, patch }
}