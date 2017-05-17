import { request, config } from '../utils'
const { api } = config
const { currentUser, userLogout, userLogin } = api

export async function login (params) {
  return request({
    url: userLogin,
    method: 'post',
    data: params,
  })
}

export async function logout () {
  return request({
    url: userLogout,
    method: 'get',
    // data: params,
  })
}

export async function query (params) {
  return request({
    url: currentUser,
    method: 'get',
    data: params,
  })
}
