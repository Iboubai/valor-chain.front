import Swal from 'sweetalert2'

export const useSwal = () => {
  const alert = (options) => Swal.fire(options)
  return { alert }
}