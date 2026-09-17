import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ProfilAvatar } from '../../atoms/profil-avatar'
import { getInitials } from '../../utils/get-initials'
import type { ProfilHeaderProps } from './profil-header.types'
import './profil-header.scss'

export const ProfilHeader = ({ displayName, memberSinceLabel, onSaveName }: ProfilHeaderProps) => {
  const { t } = useTranslation('profil')
  const [isEditing, setIsEditing] = useState(false)
  const [draftName, setDraftName] = useState(displayName)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
    }
  }, [isEditing])

  const startEditing = () => {
    setDraftName(displayName)
    setIsEditing(true)
  }

  const commit = () => {
    onSaveName(draftName.trim())
    setIsEditing(false)
  }

  return (
    <div className="profil-header">
      <ProfilAvatar initials={getInitials(displayName)} />
      <div className="profil-header__info">
        {isEditing ? (
          <input
            ref={inputRef}
            className="profil-header__name-input"
            value={draftName}
            placeholder={t('header.namePlaceholder')}
            onChange={(event) => setDraftName(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => event.key === 'Enter' && commit()}
          />
        ) : (
          <button type="button" className="profil-header__name" onClick={startEditing}>
            {displayName || t('header.namePlaceholder')}
          </button>
        )}
        <span className="profil-header__meta">
          {t('header.memberSince', { date: memberSinceLabel })}
        </span>
      </div>
    </div>
  )
}
