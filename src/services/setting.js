import request from '../utils/request';

export async function listSetting() {
  return request('/api/setting/list', {
    method: 'GET',
    headers: { token: sessionStorage.getItem('token') },
  });
}
