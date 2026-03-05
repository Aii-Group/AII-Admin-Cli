import dayjs from 'dayjs'

export function importImg(file: string, name: string) {
    return new URL(`/src/assets/${file}/${name}`, import.meta.url).href
}

export function formatDateTime(dateTime: number, format: string = 'YYYY-MM-DD HH:mm:ss') {
    if (dateTime < 10000000000) {
        return dayjs.unix(dateTime).format(format)
    }
    return dayjs(dateTime).format(format)
}
