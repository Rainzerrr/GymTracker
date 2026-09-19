import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@shared/atoms/button'
import { PageTemplate } from '@shared/templates/page-template'
import { useSessions } from '../../hooks/use-sessions'
import { SessionList, SessionListHeader } from '../../organisms/session-list'

export const SeancesPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('seances')
  const { sessions, removeSession } = useSessions()
  const [editMode, setEditMode] = useState(false)

  const listItems = sessions.map((session) => ({
    id: session.id,
    name: session.name,
    subtitle: session.focusLabel
      ? t('list.itemSubtitleWithFocus', { focus: session.focusLabel, count: session.exercises.length })
      : t('list.itemSubtitle', { count: session.exercises.length }),
    imageUrl: session.imageUrl,
  }))

  return (
    <PageTemplate
      header={
        <SessionListHeader
          sessionCount={sessions.length}
          editMode={editMode}
          onToggleEditMode={() => setEditMode((value) => !value)}
        />
      }
    >
      <SessionList
        sessions={listItems}
        editMode={editMode}
        onSelect={(id) => navigate(`/seances/${id}`)}
        onDelete={removeSession}
        onCreate={() => navigate('/seances/nouvelle')}
      />
      <Button label={t('list.planWeek')} variant="outline" fullWidth onClick={() => navigate('/seances/planning')} />
    </PageTemplate>
  )
}
