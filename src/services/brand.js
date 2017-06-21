import { request, config } from '../utils'
const { api } = config
const { brand, brands } = api

export async function query (params) {
  return request({
    url: brands,
    method: 'get',
    data: params,
  })
}

export async function get (params) {
  return request({
    url: brand,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: brands,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: brand,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: brand,
    method: 'patch',
    data: params,
  })
}
