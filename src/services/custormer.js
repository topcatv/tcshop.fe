import { request, config } from '../utils'
const { api } = config
const { custormer, custormers } = api

export async function query (params) {
  return request({
    url: custormers,
    method: 'get',
    data: params,
  })
}

export async function get (params) {
  return request({
    url: custormer,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: custormers,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: custormer,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: custormer,
    method: 'patch',
    data: params,
  })
}
