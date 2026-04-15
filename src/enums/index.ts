export const languageEnums: Record<string, string> = {
    ZH: 'zh-CN',
    EN: 'en',
} as const

export const ThemeEnum: Record<string, string> = {
    colorPrimary: '#697EFF',
    colorSuccess: '#19C35D',
    colorWarning: '#FBAD20',
    colorError: '#FA5236',
} as const

export const ResultEnum: Record<string, number | string> = {
    SUCCESS: 200,
    ERROR: 500,
    OVERDUE: 401,
    TIMEOUT: 10000,
    TYPE: 'success',
} as const

export const RequestEnum: Record<string, string> = {
    GET: 'GET',
    POST: 'POST',
    PATCH: 'PATCH',
    PUT: 'PUT',
    DELETE: 'DELETE',
} as const

export const ContentTypeEnum: Record<string, string> = {
    JSON: 'application/json;charset=UTF-8',
    TEXT: 'text/plain;charset=UTF-8',
    FORM_URLENCODED: 'application/x-www-form-urlencoded;charset=UTF-8',
    FORM_DATA: 'multipart/form-data;charset=UTF-8',
} as const

export const TypeToExtEnum: Record<string, string> = {
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
} as const

export const DownloadTypes: string[] = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/octet-stream',
    'application/pdf',
    'application/zip',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.ms-powerpoint',
    'text/csv',
    'image/',
] as const

export const OperationTypeEnum: Record<string, string> = {
    CREATE: 'Create',
    ADD: 'Add',
    EDIT: 'Edit',
    DETAIL: 'Detail',
    COPY: 'Copy',
    DELETE: 'Delete',
    EXPORT: 'Export',
    IMPORT: 'Import',
    BATCH_DELETE: 'Batch_Delete',
    BATCH_EXPORT: 'Batch_Export',
    BATCH_IMPORT: 'Batch_Import',
} as const
