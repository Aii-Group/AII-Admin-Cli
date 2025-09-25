import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

// ==================== 类型定义 ====================

/** 基础响应结构 */
interface BaseResponse<T = any> {
    code: number
    msg: string
    success: boolean
    data: T
    timestamp?: string
}

/** 登录请求参数 */
interface LoginRequest {
    username: string
    password: string
}

/** 登录响应数据 */
interface LoginData {
    userId: string
    userName: string
    token: string
    permissions: string[]
    userInfo?: {
        avatar?: string
        email?: string
        phone?: string
        role?: 'admin' | 'user' | 'guest'
        lastLoginTime?: string
    }
}

/** 菜单项 */
interface MenuItem {
    key: string
    label: string
    icon?: string
    path: string
    filePath?: string
    link?: string
    children?: MenuItem[]
    order?: number
    hidden?: boolean
    disabled?: boolean
    permission?: string
}

/** 表格数据项 */
interface TableDataItem {
    id: number
    name: string
    age: number
    address: string
    email: string
    phone: string
    createTime: string
    updateTime?: string
    status?: 'active' | 'inactive' | 'pending' | 'deleted'
    gender?: 'male' | 'female' | 'other'
    department?: string
    position?: string
    salary?: number
}

/** 表格查询参数 */
interface TableQueryParams {
    current?: number
    pageSize?: number
    address?: string
    age?: string
    email?: string
    username?: string
    status?: 'active' | 'inactive' | 'pending' | 'deleted' | ''
    department?: string
    startDate?: string
    endDate?: string
    sortBy?: 'id' | 'name' | 'age' | 'createTime' | 'updateTime'
    sortOrder?: 'asc' | 'desc'
}

/** 分页响应数据 */
interface PageResponse<T> {
    list: T[]
    total: number
    current?: number
    pageSize?: number
    totalPages?: number
}

// ==================== 常量定义 ====================

const RESPONSE_CODES = {
    SUCCESS: 200,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
} as const

const DEFAULT_CREDENTIALS = {
    USERNAME: 'admin',
    PASSWORD: '123456',
} as const

const DEFAULT_PAGINATION = {
    CURRENT: 1,
    PAGE_SIZE: 10,
    TOTAL: 1000,
} as const

// ==================== 工具函数 ====================

/** 创建成功响应 */
const createSuccessResponse = <T>(data: T, msg = 'success'): BaseResponse<T> => ({
    code: RESPONSE_CODES.SUCCESS,
    msg,
    success: true,
    data,
    timestamp: new Date().toISOString(),
})

/** 创建错误响应 */
const createErrorResponse = (code: number, msg: string): BaseResponse<null> => ({
    code,
    msg,
    success: false,
    data: null,
    timestamp: new Date().toISOString(),
})

/** 生成表格数据 */
const generateTableData = (pageSize: number, current: number): TableDataItem[] => {
    return Mock.mock({
        [`list|${pageSize}`]: [
            {
                'id|+1': (current - 1) * pageSize + 1,
                name: '@cname',
                'age|18-60': 1,
                address: '@province@city@county(true) - @city@county(true) - 详细地址: @street@natural(100, 999)号',
                email: '@email',
                phone: /^1[3-9]\d{9}/,
                createTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
                updateTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
                'status|1': ['active', 'inactive', 'pending'],
                'gender|1': ['male', 'female', 'other'],
                'department|1': ['技术部', '产品部', '运营部', '市场部', '人事部'],
                'position|1': ['前端工程师', '后端工程师', '产品经理', '运营专员', '市场专员'],
                'salary|8000-50000.2': 1,
            },
        ],
    }).list
}

// ==================== Mock 数据 ====================

const mockMenuData: MenuItem[] = [
    {
        key: 'Dashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        path: '/dashboard',
        filePath: '/dashboard/index',
    },
    {
        key: 'Tab',
        label: 'Tab',
        icon: 'tab',
        path: '/tab',
        filePath: '/tab/index',
    },
    {
        key: 'Table',
        label: 'Table',
        icon: 'table',
        path: '/table',
        children: [
            {
                key: 'Basic_Table',
                label: 'Basic Table',
                path: '/table/basic',
                filePath: '/table/basic',
            },
            {
                key: 'Advanced_Table',
                label: 'Advanced Table',
                path: '/table/advanced',
                filePath: '/table/advanced',
            },
        ],
    },
    {
        key: 'External_Link',
        label: 'External Link',
        icon: 'link',
        path: '/iframe',
        children: [
            {
                key: 'Baidu',
                label: 'Baidu',
                path: '/iframe/Baidu',
                link: 'https://www.baidu.com/',
                filePath: '/iframe/index',
            },
            {
                key: 'React',
                label: 'React',
                path: '/iframe/React',
                link: 'https://zh-hans.react.dev/',
                filePath: '/iframe/index',
            },
        ],
    },
]

// ==================== API Mock 定义 ====================

const mockApis: MockMethod[] = [
    // 用户登录
    {
        url: '/api/v1/login',
        method: 'post',
        timeout: 10,
        response: ({ body }: { body: LoginRequest }): BaseResponse<LoginData | null> => {
            const { username, password } = body

            // 参数验证
            if (!username || !password) {
                return createErrorResponse(RESPONSE_CODES.UNAUTHORIZED, 'Username and password are required')
            }

            // 身份验证
            if (username === DEFAULT_CREDENTIALS.USERNAME && password === DEFAULT_CREDENTIALS.PASSWORD) {
                const loginData: LoginData = {
                    userId: '1008',
                    userName: 'admin',
                    token: Mock.Random.guid(),
                    permissions: ['Dashboard', 'Basic_Table', 'Advanced_Table', 'Tab'],
                    userInfo: {
                        avatar: 'https://example.com/avatar.jpg',
                        email: 'admin@example.com',
                        phone: '13812345678',
                        role: 'admin',
                        lastLoginTime: new Date().toISOString(),
                    },
                }
                return createSuccessResponse(loginData, 'Login successful')
            }

            return createErrorResponse(RESPONSE_CODES.UNAUTHORIZED, 'Invalid username or password')
        },
    },

    // 获取菜单
    {
        url: '/api/v1/getMenu',
        method: 'get',
        timeout: 10,
        response: (): BaseResponse<MenuItem[]> => {
            return createSuccessResponse(mockMenuData)
        },
    },

    // 获取表格数据
    {
        url: '/api/v1/getTableData',
        method: 'post',
        timeout: 0,
        statusCode: 200,
        response: ({ body }: { body: TableQueryParams }): BaseResponse<PageResponse<TableDataItem> | null> => {
            const { current = DEFAULT_PAGINATION.CURRENT, pageSize = DEFAULT_PAGINATION.PAGE_SIZE } = body

            // 参数验证
            if (current < 1 || pageSize < 1 || pageSize > 100) {
                return createErrorResponse(RESPONSE_CODES.UNAUTHORIZED, 'Invalid pagination parameters')
            }

            // 生成数据
            const list = generateTableData(pageSize, current)
            const totalPages = Math.ceil(DEFAULT_PAGINATION.TOTAL / pageSize)
            const responseData: PageResponse<TableDataItem> = {
                list,
                total: DEFAULT_PAGINATION.TOTAL,
                current,
                pageSize,
                totalPages,
            }

            return createSuccessResponse(responseData)
        },
    },
]

export default mockApis
