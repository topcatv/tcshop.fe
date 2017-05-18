import { request, config } from '../utils'
const { api } = config
const { role } = api

export async function query (params) {
  return request({
    url: role.replace('/:id', ''),
    method: 'get',
    data: params,
  })
}

export async function get (params) {
  return request({
    url: role.replace('/:id', `/${params.id}`),
    method: 'get',
  })
}

export async function create (params) {
  return request({
    url: role.replace('/:id', '/add'),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: role.replace('/:id', `/${params.id}`),
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: role,
    method: 'patch',
    data: params,
  })
}
