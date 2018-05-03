import { message } from 'antd';
import * as setting from '../services/setting';

export default {

  namespace: 'setting',

  state: {
    settingData: {},
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(setting.listSetting, payload);
      if (response.code === 'error') { message.error(response.reason); }
      yield put({ type: 'changeSettingData', payload: response.content });
    },
  },

  reducers: {
    changeSettingData(state, { payload }) {
      return { ...state, settingData: payload };
    },
  },
};
