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

// 拦截器类型定义
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

export interface BaseResponse {
    // 响应状态码
    code: number
    // 响应消息
    msg: string
    // 请求是否成功
    success: boolean
    // 响应时间戳
    timestamp?: string
}

export type ErrorResponse = any

export interface LoginRequest {
    // 用户名
    username: string
    // 密码
    password: string
}

export interface LoginData {
    // 用户ID
    userId: string
    // 用户名
    userName: string
    // 访问令牌
    token: string
    // 用户权限列表
    permissions: 'Dashboard' | 'Basic_Table' | 'Advanced_Table' | 'Tab' | 'User_Management' | 'System_Settings'[]
    // 用户详细信息
    userInfo?: {
        avatar?: string
        email?: string
        phone?: string
        role?: 'admin' | 'user' | 'guest'
        lastLoginTime?: string
    }
}

export interface MenuItem {
    // 菜单唯一标识
    key: string
    // 菜单显示名称
    label: string
    // 菜单图标
    icon?: string
    // 菜单路径
    path: string
    // 文件路径
    filePath?: string
    // 外部链接
    link?: string
    // 子菜单列表
    children?: MenuItem[]
    // 菜单排序
    order?: number
    // 是否隐藏菜单
    hidden?: boolean
    // 是否禁用菜单
    disabled?: boolean
    // 访问权限
    permission?: string
}

export interface TableQueryParams {
    // 当前页码
    current?: number
    // 每页条数
    pageSize?: number
    // 用户名筛选
    username?: string
    // 邮箱筛选
    email?: string
    // 地址筛选
    address?: string
    // 年龄筛选
    age?: string
    // 状态筛选
    status?: 'active' | 'inactive' | 'pending' | 'deleted' | ''
    // 部门筛选
    department?: string
    // 开始日期筛选
    startDate?: string
    // 结束日期筛选
    endDate?: string
    // 排序字段
    sortBy?: 'id' | 'name' | 'age' | 'createTime' | 'updateTime'
    // 排序方向
    sortOrder?: 'asc' | 'desc'
}

export interface TableDataItem {
    // 记录ID
    id: number
    // 姓名
    name: string
    // 年龄
    age: number
    // 地址
    address: string
    // 邮箱
    email: string
    // 手机号
    phone: string
    // 创建时间
    createTime: string
    // 更新时间
    updateTime?: string
    // 状态
    status?: 'active' | 'inactive' | 'pending' | 'deleted'
    // 性别
    gender?: 'male' | 'female' | 'other'
    // 部门
    department?: string
    // 职位
    position?: string
    // 薪资
    salary?: number
}

export interface PageResponse {
    // 数据列表
    list: TableDataItem[]
    // 总记录数
    total: number
    // 当前页码
    current?: number
    // 每页条数
    pageSize?: number
    // 总页数
    totalPages?: number
    // 是否有下一页
    hasNext?: boolean
    // 是否有上一页
    hasPrev?: boolean
}
