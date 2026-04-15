import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/_authentication/form/advanced-form')({
    component: RouteComponent,
    staticData: { key: 'Advanced_Form' },
})

function RouteComponent() {
    const { t } = useTranslation()
    return <p className="text-muted-foreground">{t('Form.Advanced_Form_Placeholder')}</p>
}
