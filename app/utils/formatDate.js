import dayjs from 'dayjs'
import 'dayjs/locale/fr'

dayjs.locale('fr')

export const formatDate = (date) => {
  if (!date) return '—'
  return dayjs(date).format('DD/MM/YYYY')
}
