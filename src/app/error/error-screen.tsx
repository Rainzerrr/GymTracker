import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@shared/atoms/button'
import { PageTemplate } from '@shared/templates/page-template'
import './error-screen.scss'

type ErrorScreenProps = {
  title: string
  message: string
}

export const ErrorScreen = ({ title, message }: ErrorScreenProps) => {
  const { t } = useTranslation('common')
  const navigate = useNavigate()

  return (
    <PageTemplate>
      <div className="error-screen">
        <h1 className="error-screen__title">{title}</h1>
        <p className="error-screen__message">{message}</p>
        <Button
          label={t('errors.backHome')}
          variant="accent"
          fullWidth
          onClick={() => navigate('/')}
        />
      </div>
    </PageTemplate>
  )
}
