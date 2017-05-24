import { request, config } from '../utils'
const { api } = config
const { role, roles, permissions } = api

export async function query (params) {
  return request({
    url: roles,
    method: 'get',
    data: params,
  })
}

export async function get (params) {
  return request({
    url: role,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: roles,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: role,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: role,
    method: 'patch',
    data: params,
  })
}

export async function queryPermissions (params) {
  return request({
    url: permissions,
    method: 'get',
    data: params,
  })
}
