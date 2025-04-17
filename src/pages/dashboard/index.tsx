import React from 'react'
import { Typography, Space } from 'antd'
import Google from '@/assets/svg/LogosGoogle.svg?react'
import Edge from '@/assets/svg/LogosMicrosoftEdge.svg?react'
import FireFox from '@/assets/svg/LogosFirefox.svg?react'
import Safari from '@/assets/svg/LogosSafari.svg?react'

const { Paragraph, Link } = Typography
const technologyStack = [
  {
    stack: 'React18',
    href: 'https://zh-hans.react.dev/',
  },
  {
    stack: 'TS',
    href: 'https://ts.nodejs.cn/',
  },
  {
    stack: 'Ant Design',
    href: 'https://ant-design.antgroup.com/index-cn',
  },
  {
    stack: 'Vite',
    href: 'https://cn.vitejs.dev/',
  },
]
const Dashboard: React.FC = () => {
  return (
    <>
      <div className="wrapper">
        <div className="text-xl">
          <span className="pr-6">⛏️ 基于</span>
          {technologyStack.map((item, index) => (
            <React.Fragment key={item.stack}>
              <Link href={item.href} target="_blank">
                {item.stack}
              </Link>
              <span className="px-6">{index < technologyStack.length - 1 && '+'}</span>
            </React.Fragment>
          ))}
          <span>等技术栈开发的后台管理系统</span>
        </div>
        <div className="mt-10">
          <Paragraph>
            👉 1️⃣ React 18 使用了新的 Concurrent Rendering（并发渲染）特性，这需要现代浏览器的事件调度机制，而 IE
            的性能和兼容性无法满足要求。
          </Paragraph>
          <Paragraph>
            👉 2️⃣ React 18 默认启用了新的 createRoot API，取代了 ReactDOM.render，而 IE 在处理这些新 API
            时可能会出现问题。
          </Paragraph>
          <Paragraph>
            👉 3️⃣ 依赖的工具链（如 Vite 或现代 Webpack 配置）通常也不再为 IE 做额外的 polyfill 或降级处理
          </Paragraph>
        </div>
        <div>‼️ 所以，请使用以下浏览器 👇</div>
        <div className="mt-10">
          <Space size="large">
            <Google className="w-40 h-40" />
            <Edge className="w-40 h-40" />
            <FireFox className="w-40 h-40" />
            <Safari className="w-40 h-40" />
          </Space>
        </div>
      </div>
    </>
  )
}
export default Dashboard
