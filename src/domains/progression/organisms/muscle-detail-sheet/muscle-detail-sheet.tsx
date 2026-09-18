import { useTranslation } from 'react-i18next'
import { BottomSheet } from '@shared/organisms/bottom-sheet'
import { Thumbnail } from '@shared/atoms/thumbnail'
import { INDIRECT_SET_WEIGHT } from '../../data/muscle-config'
import { formatSets } from '../../utils/format-sets'
import type { MuscleDetailSheetProps } from './muscle-detail-sheet.types'
import './muscle-detail-sheet.scss'

export const MuscleDetailSheet = ({ volume, label, onClose }: MuscleDetailSheetProps) => {
  const { t } = useTranslation('progression')
  const { status, directSets, indirectSets, effectiveSets, targetSets, contributions } = volume
  const progressPercent = Math.min(100, (effectiveSets / targetSets) * 100)

  return (
    <BottomSheet title={label} eyebrow={t('volume.detail.eyebrow')} onClose={onClose}>
      <div className="muscle-detail-sheet">
        <section className="muscle-detail-sheet__hero">
          <div className="muscle-detail-sheet__figures">
            <span className="muscle-detail-sheet__value">{formatSets(effectiveSets)}</span>
            <span className="muscle-detail-sheet__target">
              {t('volume.detail.target', { target: targetSets })}
            </span>
          </div>
          <div className="muscle-detail-sheet__bar">
            <div
              className={`muscle-detail-sheet__bar-fill muscle-detail-sheet__bar-fill--${status}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className={`muscle-detail-sheet__status muscle-detail-sheet__status--${status}`}>
            {t(`volume.status.${status}`)}
          </span>
        </section>

        <section className="muscle-detail-sheet__split">
          <div className="muscle-detail-sheet__split-item">
            <span className="muscle-detail-sheet__split-value">{directSets}</span>
            <span className="muscle-detail-sheet__split-label">{t('volume.detail.direct')}</span>
          </div>
          <div className="muscle-detail-sheet__split-item">
            <span className="muscle-detail-sheet__split-value">{indirectSets}</span>
            <span className="muscle-detail-sheet__split-label">{t('volume.detail.indirect')}</span>
          </div>
        </section>

        <section className="muscle-detail-sheet__exercises">
          <h3 className="muscle-detail-sheet__section-title">{t('volume.detail.exercises')}</h3>

          {contributions.length === 0 ? (
            <p className="muscle-detail-sheet__empty">{t('volume.detail.empty')}</p>
          ) : (
            <ul className="muscle-detail-sheet__list">
              {contributions.map((contribution) => (
                <li key={contribution.exerciseId} className="muscle-detail-sheet__row">
                  <Thumbnail src={contribution.thumbnailUrl} alt={contribution.name} />
                  <span className="muscle-detail-sheet__row-text">
                    <span className="muscle-detail-sheet__row-name">{contribution.name}</span>
                    <span className="muscle-detail-sheet__row-sets">
                      {t('volume.detail.sets', { count: contribution.sets })}
                    </span>
                  </span>
                  <span
                    className={`muscle-detail-sheet__tag ${
                      contribution.isDirect ? 'muscle-detail-sheet__tag--direct' : ''
                    }`}
                  >
                    {contribution.isDirect
                      ? t('volume.detail.tagDirect')
                      : t('volume.detail.tagIndirect')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="muscle-detail-sheet__note">
          {t('volume.detail.note', { weight: formatSets(INDIRECT_SET_WEIGHT) })}
        </p>
      </div>
    </BottomSheet>
  )
}
