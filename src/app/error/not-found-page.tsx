import { useTranslation } from 'react-i18next'
import { ErrorScreen } from './error-screen'

export const NotFoundPage = () => {
  const { t } = useTranslation('common')

  return <ErrorScreen title={t('errors.notFoundTitle')} message={t('errors.notFoundMessage')} />
}
