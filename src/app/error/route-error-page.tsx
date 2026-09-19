import { useTranslation } from 'react-i18next'
import { ErrorScreen } from './error-screen'

export const RouteErrorPage = () => {
  const { t } = useTranslation('common')

  return <ErrorScreen title={t('errors.crashTitle')} message={t('errors.crashMessage')} />
}
