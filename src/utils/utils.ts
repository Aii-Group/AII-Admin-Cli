import dayjs from 'dayjs'
import { clamp } from 'lodash-es'

// =============================================================================
// 资源 / 时间 / 类型判断 / 常用格式化等通用工具
// 约束：只放跨模块可复用的小工具；与 HTTP/路由/菜单等强耦合逻辑不要放进来。
// =============================================================================

/**
 * 基于目录/文件名生成静态资源 URL（Vite）。
 * @param file 资源目录名（位于 `src/assets/<file>/`）
 * @param name 资源文件名（包含扩展名）
 * @returns 可用于 `img src` / CSS `url()` 的完整 href
 */
export function importImg(file: string, name: string) {
    return new URL(`/src/assets/${file}/${name}`, import.meta.url).href
}

/**
 * 通用日期时间格式化。
 * - 兼容秒/毫秒时间戳：秒级通常小于 1e11（到 5138 年左右仍成立），毫秒级通常大于 1e11
 * - 解析失败返回 '-'，便于表格/详情页直接展示
 * @param dateTime 秒/毫秒时间戳，或可被 dayjs 解析的字符串/Date；传 `null/undefined` 会返回 `'-'`
 * @param format dayjs 格式化模板
 * @returns 格式化后的字符串；解析失败返回 `'-'`
 */
export function formatDateTime(
    dateTime: number | string | Date | null | undefined,
    format: string = 'YYYY-MM-DD HH:mm:ss',
) {
    if (dateTime === null || dateTime === undefined) return '-'

    const parsed =
        typeof dateTime === 'number' ? dayjs(Math.abs(dateTime) < 1e11 ? dateTime * 1000 : dateTime) : dayjs(dateTime)

    if (!parsed.isValid()) return '-'
    return parsed.format(format)
}

/**
 * 延时。
 * @param ms 延时毫秒数
 * @returns 在 `ms` 后 resolve 的 Promise
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

const objectToString = Object.prototype.toString

/**
 * 判断值是否为某个具体类型（基于 Object.prototype.toString）
 * @param val 任意值
 * @param type 例如：`'String' | 'Number' | 'Object' | 'Date'`
 * @returns 是否匹配对应类型标签
 */
export function is(val: unknown, type: string) {
    return objectToString.call(val) === `[object ${type}]`
}

/**
 * 是否为函数。
 * @param val 任意值
 * @returns 是否为函数
 */
export function isFunction<T = (...args: any[]) => any>(val: unknown): val is T {
    return is(val, 'Function')
}

/**
 * 是否已定义（不为 undefined）。
 * @param val 任意值
 * @returns `val !== undefined`
 */
export const isDef = <T = unknown>(val?: T): val is T => {
    return typeof val !== 'undefined'
}

/**
 * 是否未定义（为 undefined）。
 * @param val 任意值
 * @returns `val === undefined`
 */
export const isUnDef = <T = unknown>(val?: T): val is T => {
    return !isDef(val)
}

export const isObject = (val: unknown): val is Record<PropertyKey, unknown> => {
    return val !== null && is(val, 'Object')
}

/**
 * 是否为 Date 对象。
 * @param val 任意值
 * @returns 是否为 Date
 */
export function isDate(val: unknown): val is Date {
    return is(val, 'Date')
}

/**
 * 是否为 number（注意：NaN 也属于 number）。
 * @param val 任意值
 * @returns 是否为 number
 */
export function isNumber(val: unknown): val is number {
    return is(val, 'Number')
}

/**
 * 是否为 async function（基于 toStringTag）。
 * @param val 任意值
 * @returns 是否为 AsyncFunction
 */
export function isAsyncFunction<T = (...args: any[]) => Promise<any>>(val: unknown): val is T {
    return is(val, 'AsyncFunction')
}

/**
 * Promise 类型判断（偏保守）。
 * 注意：它只覆盖原生 Promise/被标记为 [object Promise] 的实现；
 * 对“thenable”（仅有 then/catch 的对象）并不保证返回 true。
 * @param val 任意值
 * @returns 是否为 Promise
 */
export function isPromise<T = any>(val: unknown): val is Promise<T> {
    return is(val, 'Promise') && isObject(val) && isFunction((val as any).then) && isFunction((val as any).catch)
}

/**
 * 是否为字符串（基于 toStringTag）。
 * @param val 任意值
 * @returns 是否为 string
 */
export function isString(val: unknown): val is string {
    return is(val, 'String')
}

/**
 * 是否为布尔值（基于 toStringTag）。
 * @param val 任意值
 * @returns 是否为 boolean
 */
export function isBoolean(val: unknown): val is boolean {
    return is(val, 'Boolean')
}

/**
 * 是否为数组。
 * @param val 任意值
 * @returns 是否为数组
 */
export function isArray<T = any>(val: unknown): val is Array<T> {
    return Array.isArray(val)
}

/**
 * 是否运行在浏览器端（window 可用）。
 * @returns 是否为 client
 */
export const isClient = () => {
    return typeof window !== 'undefined'
}

/**
 * 是否为 Window 对象（仅在浏览器端可为 true）。
 * @param val 任意值
 * @returns 是否为 Window
 */
export const isWindow = (val: unknown): val is Window => {
    return typeof window !== 'undefined' && is(val, 'Window')
}

/**
 * 是否为 DOM Element（简易判断）。
 * @param val 任意值
 * @returns 是否为 Element
 */
export const isElement = (val: unknown): val is Element => {
    return isObject(val) && !!(val as any).tagName
}

/**
 * 是否为服务端环境（window 不存在）。
 */
export const isServer = typeof window === 'undefined'

/**
 * 是否为图片类 DOM 节点（IMG/IMAGE）。
 * @param element DOM 元素
 * @returns 是否为图片节点
 */
export function isImageDom(element: Element) {
    return ['IMAGE', 'IMG'].includes(element.tagName)
}

/**
 * 是否为 null。
 * @param val 任意值
 * @returns 是否为 null
 */
export function isNull(val: unknown): val is null {
    return val === null
}

/**
 * 判断字符串是否为 URL。
 * @param str 待判断字符串
 * @returns 是否匹配 URL 规则
 */
export function isLink(str: string) {
    // 通用 URL 正则（兼容 http/https/ftp/协议相对/localhost/IP/域名）
    const v = new RegExp(
        '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
        'i',
    )
    return v.test(str)
}

/**
 * 是否为非空字符串（会 trim）。
 * @param value 任意值
 * @returns 是否为非空字符串
 */
export function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0
}

/**
 * 数值钳制到 [min, max]。
 * @param value 原始值（若为 NaN 则返回 min）
 * @param min 下限
 * @param max 上限
 * @returns 被钳制后的数值
 */
/**
 * 将单值/数组/空值规范成数组。
 * @param value 单个元素、数组，或 null/undefined
 * @returns 数组（空值返回 []）
 */
export function ensureArray<T>(value: T | T[] | null | undefined): T[] {
    if (value === null || value === undefined) return []
    return Array.isArray(value) ? value : [value]
}

/**
 * JSON 安全解析。
 * @param text JSON 字符串
 * @returns `{ ok: true, value }` 或 `{ ok: false, error }`
 */
export function safeJsonParse<T>(text: string): { ok: true; value: T } | { ok: false; error: unknown } {
    try {
        return { ok: true, value: JSON.parse(text) as T }
    } catch (error) {
        return { ok: false, error }
    }
}

/**
 * 字节数格式化（IEC，1024 进位）。
 * - 输入非有限数返回 '-'
 * - 负数按 0 处理（避免出现 -1 B 这类 UI 噪音）
 * @param bytes 字节数
 * @param decimals 小数位（会被钳制到 0-8；B 不显示小数）
 * @returns 形如 `12.3 MB` 的字符串；异常返回 `'-'`
 */
export function formatBytes(bytes: number, decimals: number = 1) {
    if (!Number.isFinite(bytes)) return '-'
    const safeBytes = Math.max(0, bytes)
    if (safeBytes === 0) return '0 B'

    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const
    const unitIndex = Math.min(units.length - 1, Math.floor(Math.log(safeBytes) / Math.log(1024)))
    const value = safeBytes / 1024 ** unitIndex
    const safeDecimals = Number.isFinite(decimals) ? decimals : 0
    const fixed = unitIndex === 0 ? 0 : clamp(safeDecimals, 0, 8)
    return `${value.toFixed(fixed)} ${units[unitIndex]}`
}
