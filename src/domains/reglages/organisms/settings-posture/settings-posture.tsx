import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@shared/atoms/button'
import { SectionLabel } from '@shared/atoms/section-label'
import { SettingToggleRow } from '../../molecules/setting-toggle-row'
import './settings-posture.scss'

type SettingsPostureProps = {
  isEnabled: boolean
  steps: string[]
  onEnabledChange: (isEnabled: boolean) => void
  onStepsChange: (steps: string[]) => void
  onResetSteps: () => void
}

export const SettingsPosture = ({
  isEnabled,
  steps,
  onEnabledChange,
  onStepsChange,
  onResetSteps,
}: SettingsPostureProps) => {
  const { t } = useTranslation('reglages')
  const { t: tCommon } = useTranslation('common')
  const [newStep, setNewStep] = useState('')

  const updateStep = (index: number, value: string) =>
    onStepsChange(steps.map((step, position) => (position === index ? value : step)))

  const removeStep = (index: number) =>
    onStepsChange(steps.filter((_step, position) => position !== index))

  const addStep = () => {
    if (newStep.trim() === '') {
      return
    }

    onStepsChange([...steps, newStep.trim()])
    setNewStep('')
  }

  return (
    <section>
      <SectionLabel label={t('posture.label')} />
      <SettingToggleRow
        title={t('posture.enabled')}
        checked={isEnabled}
        onChange={onEnabledChange}
      />
      {isEnabled && (
        <div className="settings-posture__steps">
          <span className="settings-posture__label">{t('posture.stepsLabel')}</span>
          {steps.map((step, index) => (
            <div key={index} className="settings-posture__row">
              <input
                className="settings-posture__input"
                value={step}
                placeholder={t('posture.stepPlaceholder')}
                onChange={(event) => updateStep(index, event.target.value)}
              />
              <button
                type="button"
                className="settings-posture__remove"
                onClick={() => removeStep(index)}
                aria-label={tCommon('actions.delete')}
              >
                ×
              </button>
            </div>
          ))}
          <div className="settings-posture__row">
            <input
              className="settings-posture__input"
              value={newStep}
              placeholder={t('posture.newStepPlaceholder')}
              onChange={(event) => setNewStep(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && addStep()}
            />
            <Button label={t('posture.addStep')} variant="outline" onClick={addStep} />
          </div>
          <Button label={t('posture.reset')} variant="outline" fullWidth onClick={onResetSteps} />
        </div>
      )}
    </section>
  )
}
