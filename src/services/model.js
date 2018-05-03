import request from '../utils/request';

export async function addModel(params) {
  return request('/api/model', {
    method: 'POST',
    body: params,
    headers: { token: sessionStorage.getItem('token') },
  });
}

export async function listModel(params) {
  return request('/api/model/list', {
    method: 'POST',
    body: params,
    headers: { token: sessionStorage.getItem('token') },
  });
}

export async function listAllModel() {
  return request('/api/model/list', {
    method: 'GET',
    headers: { token: sessionStorage.getItem('token') },
  });
}

export async function deleteModel(params) {
  return request(`/api/model/${params.id}`, {
    method: 'DELETE',
    headers: { token: sessionStorage.getItem('token') },
  });
}

export async function getModel(params) {
  return request(`/api/model/${params.id}`, {
    method: 'GET',
    headers: { token: sessionStorage.getItem('token') },
  });
}

export async function modifyModel(params) {
  return request(`/api/model/${params.id}`, {
    method: 'PUT',
    body: params,
    headers: { token: sessionStorage.getItem('token') },
  });
}
