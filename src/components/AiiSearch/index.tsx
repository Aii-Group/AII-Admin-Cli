import { useState } from 'react'
import { Col, Row, Form, Space, Button, Tooltip } from 'antd'
import { Down, Clear, Search } from '@icon-park/react'
import { useTranslation } from 'react-i18next'

interface AiiSearchProps {
  items: React.ReactElement<typeof Form.Item>[]
  cols?: number
  onSearch?: (value: any) => void
}

const AiiSearch: React.FC<AiiSearchProps> = (props) => {
  const { items, onSearch } = props
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [expand, setExpand] = useState(false)

  const getFields = () => {
    const count = expand ? items.length : items.length < 4 ? items.length : 4
    const children = []
    for (let i = 0; i < count; i++) {
      children.push(
        <Col key={i} span={6}>
          {items[i]}
        </Col>,
      )
    }
    return children
  }

  const onFinish = (values: Record<string, any> = {}) => {
    onSearch && onSearch(values)
  }

  return (
    <div className={`wrapper mb-10 ${items.length < 4 ? 'pb-0' : ''}`}>
      <Form form={form} name="advanced_search" onFinish={onFinish}>
        <Row gutter={24}>
          {getFields()}
          <Col span={items.length < 4 ? 6 : 24}>
            <div className={items.length < 4 ? '' : 'text-right'}>
              <Space size="small">
                <Button icon={<Search />} type="primary" htmlType="submit">
                  {t('Action.Search')}
                </Button>
                <Button
                  icon={<Clear />}
                  onClick={() => {
                    form.resetFields()
                  }}
                >
                  {t('Action.Reset')}
                </Button>
                {items.length > 4 && (
                  <Tooltip title={expand ? t('Action.Collapse') : t('Action.Expand')}>
                    <a
                      className={`flex items-center hover:text-light-colorPrimary dark:hover:text-dark-colorPrimary transition-all duration-300 ease-in-out ${expand ? 'rotate-180' : 'rotate-0'}`}
                      onClick={() => {
                        setExpand(!expand)
                      }}
                    >
                      <Down />
                    </a>
                  </Tooltip>
                )}
              </Space>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
export default AiiSearch
