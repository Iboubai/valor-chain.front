export const useAuth = () => {
  const token = useState<string | null>('auth-token', () => null)
  const setToken = (newToken: string) => { token.value = newToken }
  return { token, setToken }
}