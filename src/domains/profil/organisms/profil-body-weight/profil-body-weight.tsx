import { useTranslation } from 'react-i18next'
import { Button } from '@shared/atoms/button'
import { SectionLabel } from '@shared/atoms/section-label'
import { NumberField } from '@shared/molecules/number-field'
import { formatShortDateLabel } from '@shared/utils/date/format-date-label'
import { TrendLine } from '../../atoms/trend-line'
import { computeWeightDeltas } from '../../utils/body-weight-history'
import type { ProfilBodyWeightProps } from './profil-body-weight.types'
import './profil-body-weight.scss'

const VISIBLE_ENTRIES = 5

export const ProfilBodyWeight = ({
  bodyWeightKg,
  onChange,
  history,
  onRecord,
  onRemoveEntry,
}: ProfilBodyWeightProps) => {
  const { t } = useTranslation('profil')
  const { t: tCommon } = useTranslation('common')

  const deltas = computeWeightDeltas(history)
  const recentRows = history
    .map((entry, index) => ({ entry, delta: deltas[index] }))
    .slice(-VISIBLE_ENTRIES)
    .reverse()

  return (
    <section>
      <SectionLabel label={t('bodyWeight.label')} />
      <div className="profil-body-weight">
        <NumberField label={t('bodyWeight.field')} value={bodyWeightKg} onChange={onChange} />
        <p className="profil-body-weight__hint">{t('bodyWeight.hint')}</p>
        <Button label={t('bodyWeight.record')} variant="outline" fullWidth onClick={onRecord} />
        <TrendLine values={history.map((entry) => entry.kg)} label={t('bodyWeight.trendLabel')} />
        {recentRows.length === 0 ? (
          <p className="profil-body-weight__hint">{t('bodyWeight.historyEmpty')}</p>
        ) : (
          <ul className="profil-body-weight__history">
            {recentRows.map(({ entry, delta }) => (
              <li key={entry.recordedAt} className="profil-body-weight__row">
                <span className="profil-body-weight__date">
                  {formatShortDateLabel(entry.recordedAt)}
                </span>
                <span className="profil-body-weight__value">
                  {t('bodyWeight.entryValue', { value: entry.kg })}
                </span>
                <span className="profil-body-weight__delta">
                  {delta === null || delta === 0 ? '' : t('bodyWeight.delta', { value: delta })}
                </span>
                <button
                  type="button"
                  className="profil-body-weight__remove"
                  onClick={() => onRemoveEntry(entry.recordedAt)}
                  aria-label={tCommon('actions.delete')}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
