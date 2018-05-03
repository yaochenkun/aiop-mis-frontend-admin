import { routerRedux } from 'dva/router';
import { message } from 'antd';
import * as ability from '../services/ability';
import { PAGE_SIZE } from './../common/config';

export default {

  namespace: 'ability',

  state: {
    submitting: false,
    loading: false,
    abilityTableData: { list: [], pagination: { pageSize: PAGE_SIZE, total: 0 } },
    curAbility: {},
    modelIdSelectDisabled: false,
  },

  effects: {
    *add({ payload }, { call, put }) {
      yield put({ type: 'changeSubmitting', payload: true });
      const response = yield call(ability.addAbility, payload);
      yield put({ type: 'changeSubmitting', payload: false });
      if (response.code === 'error') { message.error(response.reason); return; }
      message.success(response.reason);
      yield put(routerRedux.push('/ability/ability-manage'));
    },
    *list({ payload }, { call, put }) {
      yield put({ type: 'changeLoading', payload: true });
      const response = yield call(ability.listAbility, payload);
      yield put({ type: 'changeLoading', payload: false });
      if (response.code === 'error') { message.error(response.reason); return; }
      console.log(response.content);
      yield put({ type: 'changeAbilityTableData', payload: { ...response.content, pageNow: payload.pageNow } });
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(ability.deleteAbility, payload);
      if (response.code === 'error') { message.error(response.reason); return; }
      message.success(response.reason);
      yield put({ type: 'list', payload: { pageSize: PAGE_SIZE, pageNow: 1 } }); // 刷新表格
    },
    *get({ payload }, { call, put }) {
      const response = yield call(ability.getAbility, payload);
      if (response.code === 'error') { message.error(response.reason); return; }
      yield put({ type: 'changeCurAbility', payload: response.content });
    },
    *getThenSetModelIdSelectDisabled({ payload }, { call, put }) {
      const response = yield call(ability.getAbility, payload);
      if (response.code === 'error') { message.error(response.reason); return; }
      yield put({ type: 'changeCurAbility', payload: response.content });
      yield put({ type: 'changeModelIdSelectDisabled', payload: response.content.type === '基础算法' ? true : false });
    },
    *update({ payload }, { call, put }) {
      const response = yield call(ability.updateAbility, payload);
      if (response.code === 'error') { message.error(response.reason); return; }
      message.success(response.reason);
      yield put({ type: 'getThenSetModelIdSelectDisabled', payload: { id: payload.id } });
    },
  },

  reducers: {
    changeSubmitting(state, { payload }) {
      return { ...state, submitting: payload };
    },
    changeLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
    changeAbilityTableData(state, { payload }) {
      return { ...state, abilityTableData: { list: payload.data, pagination: { ...state.abilityTableData.pagination, current: payload.pageNow, total: payload.rowTotal } } };
    },
    changeCurAbility(state, { payload }) {
      return { ...state, curAbility: payload };
    },
    changeModelIdSelectDisabled(state, { payload }) {
      return { ...state, modelIdSelectDisabled: payload };
    },
  },
};
