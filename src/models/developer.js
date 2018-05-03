import { message } from 'antd';
import * as developer from '../services/developer';
import * as ability from '../services/ability';
import { PAGE_SIZE } from './../common/config';

export default {

  namespace: 'developer',

  state: {
    submitting: false,
    loading: false,
    appTableData: { list: [], pagination: { pageSize: PAGE_SIZE, total: 0 } },
    curApp: {},
    curAbilityUnderAppList: [],

    // Creation
    abilityCheckboxData: [],

    // Profile
    enhanceAbilityModalVisible: false,
    curAbilityUnderApp: {},

    // Monitor
    developerAppsData: [],
    developerAbilitiesData: [],
    abilityInvokeLogStatisticData: [],
  },

  effects: {
    *occupyAbility({ payload }, { call, put }) {
      yield put({ type: 'changeSubmitting', payload: true });
      const response = yield call(developer.occupyAbility, payload);
      yield put({ type: 'changeSubmitting', payload: false });
      if (response.code === 'error') { message.error(response.reason); return; }
      message.success(response.reason);
      yield put({ type: 'listAbilityUnderApp', payload: { id: payload.appId } });
    },
    *list({ payload }, { call, put }) {
      yield put({ type: 'changeLoading', payload: true });
      const response = yield call(developer.listDeveloper, payload);
      yield put({ type: 'changeLoading', payload: false });
      if (response.code === 'error') { message.error(response.reason); return; }
      yield put({ type: 'changeAppTableData', payload: { ...response.content, pageNow: payload.pageNow } });
    },
    *listAbilityUnderApp({ payload }, { call, put }) {
      const response = yield call(developer.listAbilityUnderApp, payload);
      if (response.code === 'error') { message.error(response.reason); return; }
      yield put({ type: 'changeCurAbilityUnderAppList', payload: response.content });
    },
    *listAppUnderDeveloper({ payload }, { call, put }) {
      yield put({ type: 'changeLoading', payload: true });
      const response = yield call(developer.get, payload);
      yield put({ type: 'changeLoading', payload: false });
      if (response.code === 'error') { message.error(response.reason); return; }
      yield put({ type: 'changeAppTableData', payload: { ...response.content, pageNow: payload.pageNow } });
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(developer.deleteApp, payload);
      if (response.code === 'error') { message.error(response.reason); return; }
      message.success(response.reason);
      yield put({ type: 'list', payload: { pageSize: PAGE_SIZE, pageNow: 1 } }); // 刷新表格
    },
    *deleteApp({ payload }, { call, put }) {
      const response = yield call(developer.deleteApp, payload);
      if (response.code === 'error') { message.error(response.reason); return; }
      message.success(response.reason);
      yield put({ type: 'listAppUnderDeveloper', payload: { pageSize: PAGE_SIZE, pageNow: 1, developerId: payload.developerId } }); // 刷新表格
    },
    *cancelAbility({ payload }, { call, put }) {
      yield put({ type: 'changeSubmitting', payload: true });
      const response = yield call(developer.cancelAbility, payload);
      yield put({ type: 'changeSubmitting', payload: false });
      if (response.code === 'error') { message.error(response.reason); return; }
      message.success(response.reason);
      yield put({ type: 'listAbilityUnderApp', payload: { id: payload.appId } });
    },
    *get({ payload }, { call, put }) {
      const response = yield call(developer.getApp, payload);
      if (response.code === 'error') { message.error(response.reason); return; }
      yield put({ type: 'changeCurApp', payload: response.content });
    },
    *updateStatus({ payload }, { call, put }) {
      const response = yield call(developer.updateAppStatus, payload);
      if (response.code === 'error') { message.error(response.reason); return; }
      message.success(response.reason);
      yield put({ type: 'changeCurAppStatus', payload: payload.status });
    },
    *updateAbilityLimit({ payload }, { call, put }) {
      yield put({ type: 'changeSubmitting', payload: true });
      const response = yield call(developer.updateAbilityLimit, payload);
      yield put({ type: 'changeSubmitting', payload: false });
      if (response.code === 'error') { message.error(response.reason); return; }
      message.success(response.reason);
      yield put({ type: 'changeEnhanceAbilityModalVisible', payload: false }); // 关闭对话框
      yield put({ type: 'listAbilityUnderApp', payload: { id: payload.appId } });
    },
    *listDeveloperApps({ payload }, { call, put }) {
      const response = yield call(developer.listDeveloperAllApp, payload);
      if (response.code === 'error') { message.error(response.reason); return; }
      yield put({ type: 'changeDeveloperAppsData', payload: response.content });
    },
    *listDeveloperAbilities(_, { call, put }) {
      const response = yield call(ability.listAllAbility);
      if (response.code === 'error') { message.error(response.reason); return; }
      yield put({ type: 'changeDeveloperAbilitiesData', payload: response.content });
    },
    *listAbilityInvokeLogStatistic({ payload }, { call, put }) {
      const response = yield call(ability.listAbilityInvokeLogStatistic, payload);
      if (response.code === 'error') { message.error(response.reason); return; }
      yield put({ type: 'changeAbilityInvokeLogStatisticData', payload: response.content });
    },
  },

  reducers: {
    changeSubmitting(state, { payload }) {
      return { ...state, submitting: payload };
    },
    changeLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
    changeAppTableData(state, { payload }) {
      return { ...state, appTableData: { list: payload.data, pagination: { ...state.appTableData.pagination, current: payload.pageNow, total: payload.rowTotal } } };
    },
    changeCurApp(state, { payload }) {
      return { ...state, curApp: payload };
    },
    changeCurAbilityUnderAppList(state, { payload }) {
      return { ...state, curAbilityUnderAppList: payload };
    },
    changeCurAppStatus(state, { payload }) {
      return { ...state, curApp: { ...state.curApp, status: payload } };
    },
    changeEnhanceAbilityModalVisible(state, { payload }) {
      return { ...state, enhanceAbilityModalVisible: payload };
    },
    changeCurAbilityUnderApp(state, { payload }) {
      return { ...state, curAbilityUnderApp: payload };
    },
    changeAbilityCheckboxData(state, { payload }) {
      return { ...state, abilityCheckboxData: payload };
    },
    changeDeveloperAppsData(state, { payload }) {
      return { ...state, developerAppsData: payload };
    },
    changeDeveloperAbilitiesData(state, { payload }) {
      return { ...state, developerAbilitiesData: payload };
    },
    changeAbilityInvokeLogStatisticData(state, { payload }) {
      return { ...state, abilityInvokeLogStatisticData: payload };
    },
  },
};
