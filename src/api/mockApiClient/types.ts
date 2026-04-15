// 自动生成的类型定义文件
// 请勿手动修改此文件

export interface ApiResponse<T = any> {
    data: T
    status: number
    statusText: string
    headers: any
}

export interface ApiError {
    message: string
    status?: number
    code?: string
}

export interface RequestInterceptor {
    onFulfilled?: (config: any) => any | Promise<any>
    onRejected?: (error: any) => any
}

export interface ResponseInterceptor {
    onFulfilled?: (response: any) => any | Promise<any>
    onRejected?: (error: any) => any
}

export interface InterceptorConfig {
    request?: RequestInterceptor
    response?: ResponseInterceptor
}

/** 全站 JSON 接口统一信封，与 `mock/index.ts` 中 `BaseResponse<T>` 一致：`code`、`msg`、`success`、必有字段 `data`（失败时为 null）、可选 `timestamp`。 */
export interface BaseResponse {
    /** 业务状态码，与 mock 中 RESPONSE_CODES 一致。常见：200 成功；401 未授权或参数错误；403 禁止；404 不存在；500 服务端错误；599 登录过期。 */
    code: number
    /** 响应消息 */
    msg: string
    /** 请求是否成功 */
    success: boolean
    /** 响应时间戳（ISO8601） */
    timestamp?: string
    /** 业务数据。成功且语义成立时为对象或数组（见各接口 allOf 收窄）；失败或无效请求时为 null。 */
    data: any
}

/** POST /api/v1/login 的 JSON 体（具名 schema 便于生成器输出 `Types.LoginApiResponse`，避免内联交叉类型未加前缀）。 */
export type LoginApiResponse = BaseResponse & { data?: LoginData | null }

/** GET /api/v1/getMenu 的 JSON 体。 */
export type MenuApiResponse = BaseResponse & { data?: MenuItem[] }

/** POST /api/v1/getTableData 的 JSON 体。 */
export type TableDataApiResponse = BaseResponse & { data?: PageResponse | null }

export interface LoginRequest {
    /** 用户名 */
    username: string
    /** 密码 */
    password: string
}

export interface LoginData {
    /** 用户ID */
    userId: string
    /** 用户名 */
    userName: string
    /** 访问令牌 */
    token: string
    /** 用户权限列表 */
    permissions: string[]
    /** 用户详细信息 */
    userInfo?: {
        avatar?: string
        email?: string
        phone?: string
        role?: 'admin' | 'user' | 'guest'
        lastLoginTime?: string
    }
}

export interface MenuItem {
    /** 菜单唯一标识 */
    key: string
    /** 菜单显示名称 */
    label: string
    /** 菜单图标 */
    icon?: string
    /** 菜单路径 */
    path: string
    /** 文件路径 */
    filePath?: string
    /** 外部链接 */
    link?: string
    /** 子菜单列表 */
    children?: MenuItem[]
    /** 菜单排序 */
    order?: number
    /** 是否隐藏菜单 */
    hidden?: boolean
    /** 是否禁用菜单 */
    disabled?: boolean
    /** 访问权限 */
    permission?: string
}

export interface TableQueryParams {
    /** 当前页码 */
    current?: number
    /** 每页条数 */
    pageSize?: number
    /** 用户名筛选 */
    username?: string
    /** 邮箱筛选 */
    email?: string
    /** 地址筛选 */
    address?: string
    /** 年龄筛选 */
    age?: string
    /** 状态筛选 */
    status?: 'active' | 'inactive' | 'pending' | 'deleted' | ''
    /** 部门筛选 */
    department?: string
    /** 开始日期筛选 */
    startDate?: string
    /** 结束日期筛选 */
    endDate?: string
    /** 排序字段 */
    sortBy?: 'id' | 'name' | 'age' | 'createTime' | 'updateTime'
    /** 排序方向 */
    sortOrder?: 'asc' | 'desc'
}

export interface TableDataItem {
    /** 记录ID */
    id: number
    /** 姓名 */
    name: string
    /** 年龄 */
    age: number
    /** 地址 */
    address: string
    /** 邮箱 */
    email: string
    /** 手机号 */
    phone: string
    /** 创建时间（Mock 数据为本地格式 yyyy-MM-dd HH:mm:ss，非严格 ISO8601） */
    createTime: string
    /** 更新时间（格式同 createTime） */
    updateTime?: string
    /** 状态 */
    status?: 'active' | 'inactive' | 'pending' | 'deleted'
    /** 性别 */
    gender?: 'male' | 'female' | 'other'
    /** 部门 */
    department?: string
    /** 职位 */
    position?: string
    /** 薪资 */
    salary?: number
}

export interface PageResponse {
    /** 数据列表 */
    list: TableDataItem[]
    /** 总记录数 */
    total: number
    /** 当前页码 */
    current?: number
    /** 每页条数 */
    pageSize?: number
    /** 总页数 */
    totalPages?: number
}
