import React from 'react'
import { useLocation } from 'react-router-dom'

const IframePage: React.FC = () => {
  const params = new URLSearchParams(useLocation().search)
  const src = params.get('src')
  const decodedSrc = src ? decodeURIComponent(src) : ''

  if (!decodedSrc) {
    return <div>Invalid external link address</div>
  }

  return (
    <iframe
      src={decodedSrc}
      style={{ width: '100%', height: 'calc(100vh - 138px)', border: 'none' }}
      title="External Content"
    />
  )
}

export default IframePage
