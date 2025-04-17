export interface ReqLoginForm {
  username: string
  password: string
}
export interface ResLogin {
  accessToken: string
}

export interface TableResponse<T> {
  list: T[]
  total: number
}

export interface DataType {
  id: number
  name: string
  age: number
  address: string
  email: string
  phone: string
  createTime: string
}
