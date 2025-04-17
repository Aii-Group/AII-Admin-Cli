import http from '@/utils/http'
import { ReqLoginForm, ResLogin, TableResponse, DataType } from '@/interface'

export const login = (userInfo: ReqLoginForm) => {
  return http.post<ResLogin>('/login', userInfo)
}

export const getMenu = () => {
  return http.get<System.MenuOptions[]>('/getMenu', {})
}

export const getTableData = (params: Record<string, any>) => {
  return http.post<TableResponse<DataType>>('/getTableData', params)
}
