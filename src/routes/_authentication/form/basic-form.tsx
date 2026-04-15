import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/_authentication/form/basic-form')({
    component: RouteComponent,
    staticData: { key: 'Basic_Form' },
})

function RouteComponent() {
    const { t } = useTranslation()
    return <p className="text-muted-foreground">{t('Form.Basic_Form_Placeholder')}</p>
}
