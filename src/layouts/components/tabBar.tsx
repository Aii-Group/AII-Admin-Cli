import { useTranslation } from 'react-i18next'

import { useTabStore } from '@/stores/system'
import { CloseOutlined } from '@ant-design/icons'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'

const TabBar: React.FC = () => {
  const { t } = useTranslation()
  const location: Location = useLocation()
  const { tabs, removeTab } = useTabStore()
  const navigate = useNavigate()

  const handleRemoveTab = (tab: System.Tab) => {
    removeTab(tab)
    if (tabs.length > 0) {
      const currentIndex = tabs.findIndex((t) => t.code === tab.code)
      const lastTab = tabs[currentIndex - 1]

      if (lastTab && tab.path === location.pathname) {
        navigate({ to: lastTab.path, search: { url: lastTab.link ?? undefined } })
      }
    }
  }

  return (
    <div className="tab-bar">
      {tabs.map((tab, index) => {
        return (
          <Link key={index} to={tab.path} search={{ url: tab.link ?? undefined }}>
            <div className={`tab ${tab.path === location.pathname ? ' tab-active' : ''} `}>
              <span className="px-10">{t(`Menu.${tab.code}`)}</span>
              {tab.closeable && (
                <CloseOutlined
                  className="tab-close-btn"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    handleRemoveTab(tab)
                  }}
                />
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default TabBar
