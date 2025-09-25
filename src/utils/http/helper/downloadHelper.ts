import { AxiosResponse } from 'axios'

export const downloadTypes: string[] = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/octet-stream',
    'application/pdf',
    'application/zip',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.ms-powerpoint',
    'text/csv',
    'image/',
]

export const typeToExt: Record<string, string> = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-excel': 'xls',
    'application/pdf': 'pdf',
    'application/zip': 'zip',
    'application/msword': 'doc',
    'application/vnd.ms-powerpoint': 'ppt',
    'text/csv': 'csv',
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/svg+xml': 'svg',
    'image/gif': 'gif',
    'application/octet-stream': 'bin',
}

export const downloadFile = async (response: AxiosResponse) => {
    const contentType = response.headers['content-type'] || response.headers['Content-Type'] || ''
    const contentDisposition = response.headers['content-disposition'] || response.headers['Content-Disposition'] || ''
    let ext = 'bin'

    // 根据content-type确定文件扩展名
    if (contentType) {
        for (const [type, e] of Object.entries(typeToExt)) {
            if (contentType.includes(type)) {
                ext = e
                break
            }
        }
    }

    let fileName = `download.${ext}`

    // 从content-disposition头中提取文件名
    if (contentDisposition) {
        const match = contentDisposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i)
        if (match) {
            fileName = decodeURIComponent(match[1] || match[2])
        }
    }

    try {
        let blob: Blob

        // 确保正确处理blob数据
        if (response.data instanceof Blob) {
            blob = response.data
        } else if (response.data instanceof ArrayBuffer) {
            blob = new Blob([response.data], { type: contentType || 'application/octet-stream' })
        } else if (typeof response.data === 'string') {
            // 对于文本类型文件
            blob = new Blob([response.data], { type: contentType || 'text/plain' })
        } else {
            // 其他情况，尝试转换为JSON字符串
            const dataStr = typeof response.data === 'object' ? JSON.stringify(response.data) : String(response.data)
            blob = new Blob([dataStr], { type: contentType || 'application/octet-stream' })
        }

        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)

        link.href = url
        link.download = fileName
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    } catch (error) {
        console.error('Download file error:', error)
        window.$message.error('Download file failed')
    }
}
