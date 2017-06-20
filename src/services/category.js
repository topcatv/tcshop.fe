import { request, config } from '../utils'
const { api } = config
const { category, categorys,categoryTree } = api

export async function query (params) {
  return request({
    url: categorys,
    method: 'get',
    data: params,
  })
}

export async function get (params) {
  return request({
    url: category,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: categorys,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: category,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: category,
    method: 'patch',
    data: params,
  })
}

export async function queryCategoryTree (params) {
  return request({
    url: categoryTree,
    method: 'get',
    data: params,
  })
}
