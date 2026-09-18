import { useTranslation } from 'react-i18next'
import { SectionLabel } from '@shared/atoms/section-label'
import { NumberField } from '@shared/molecules/number-field'
import type { ProfilBodyWeightProps } from './profil-body-weight.types'
import './profil-body-weight.scss'

export const ProfilBodyWeight = ({ bodyWeightKg, onChange }: ProfilBodyWeightProps) => {
  const { t } = useTranslation('profil')

  return (
    <section>
      <SectionLabel label={t('bodyWeight.label')} />
      <div className="profil-body-weight">
        <NumberField label={t('bodyWeight.field')} value={bodyWeightKg} onChange={onChange} />
        <p className="profil-body-weight__hint">{t('bodyWeight.hint')}</p>
      </div>
    </section>
  )
}
