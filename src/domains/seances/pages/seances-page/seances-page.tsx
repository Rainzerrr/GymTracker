import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@shared/atoms/button'
import { PageTemplate } from '@shared/templates/page-template'
import { formatRelativeDays } from '@shared/utils/date/format-relative-days'
import { useSessionLog } from '@domains/seance-active/hooks/use-session-log'
import { useSessions } from '../../hooks/use-sessions'
import { useStarterProgram } from '../../hooks/use-starter-program'
import { SessionList, SessionListHeader } from '../../organisms/session-list'

export const SeancesPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('seances')
  const { sessions, removeSession, duplicateSession } = useSessions()
  const { installStarterProgram } = useStarterProgram()
  const { sessionLog } = useSessionLog()
  const [editMode, setEditMode] = useState(false)

  const listItems = sessions.map((session) => {
    const baseSubtitle = session.focusLabel
      ? t('list.itemSubtitleWithFocus', {
          focus: session.focusLabel,
          count: session.exercises.length,
        })
      : t('list.itemSubtitle', { count: session.exercises.length })
    const lastDoneAt = sessionLog
      .filter((entry) => entry.sessionName === session.name)
      .reduce<string | undefined>(
        (latest, entry) => (!latest || entry.completedAt > latest ? entry.completedAt : latest),
        undefined,
      )
    const subtitle = lastDoneAt
      ? `${baseSubtitle} · ${t('list.lastDone', { when: formatRelativeDays(new Date(lastDoneAt)) })}`
      : baseSubtitle

    return { id: session.id, name: session.name, subtitle, imageUrl: session.imageUrl }
  })

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
        onDuplicate={(id) => {
          const source = sessions.find((session) => session.id === id)

          if (source) {
            duplicateSession(id, t('list.copyName', { name: source.name }))
          }
        }}
        onCreate={() => navigate('/seances/nouvelle')}
        onInstallStarter={installStarterProgram}
      />
      <Button
        label={t('list.planWeek')}
        variant="outline"
        fullWidth
        onClick={() => navigate('/seances/planning')}
      />
    </PageTemplate>
  )
}
