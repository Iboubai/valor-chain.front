export function useApi() {
  const config = useRuntimeConfig() // lit les variables d'environnement NUXT_PUBLIC_*

  // Fonction GET
  const getAutorized = async <T>(endpoint: string, token?: string): Promise<T> => {
    const data = await $fetch<T>(`${config.public.apiBase}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`
      }
    })
    return data
  }

  // Fonction GET
  const get = async <T>(endpoint: string): Promise<T> => {

    const data = await $fetch<T>(`${config.public.apiBase}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return data
  }

  // Fonction POST
  const postAutorized = async <T>(endpoint: string, body: any, token?: string): Promise<T> => {
    console.log(body)
    const data = await $fetch<T>(`${config.public.apiBase}${endpoint}`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`
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
        'Content-Type': 'application/json'
      }
    })    
    return data
  }

  // Fonction POST
  const patch = async <T>(endpoint: string, body: any, token?: string) => {
    await $fetch(`${config.public.apiBase}${endpoint}`, {
      method: 'PATCH',
      body, 
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`
      }
    })
  }

  // Idem pour PUT, DELETE si besoin…
  return { get, post, getAutorized, postAutorized, patch }
}