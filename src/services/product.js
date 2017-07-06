import { request, config } from '../utils'
const { api } = config
const { product, products, brands } = api

export async function query (params) {
  return request({
    url: products,
    method: 'get',
    data: params,
  })
}

export async function get (params) {
  return request({
    url: product,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: products,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: product,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: product,
    method: 'patch',
    data: params,
  })
}

export async function queryBrands (params) {
  return request({
    url: brands,
    method: 'get',
    data: params,
  })
}
