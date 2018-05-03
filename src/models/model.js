import { message } from 'antd';
import * as model from '../services/model';
import { PAGE_SIZE } from './../common/config';

export default {

  namespace: 'model',

  state: {
    submitting: false,
    loading: false,
    modelTableData: { list: [], pagination: { pageSize: PAGE_SIZE, total: 0 } },
    modelSelectData: [],
    curModel: {},

    addModalVisible: false,
    modifyModalVisible: false,
  },

  effects: {
    *add({ payload }, { call, put }) {
      yield put({ type: 'changeSubmitting', payload: true });
      const response = yield call(model.addModel, payload);
      yield put({ type: 'changeSubmitting', payload: false });
      if (response.code === 'error') { message.error(response.reason); return; }
      message.success(response.reason);
      yield put({ type: 'changeAddModalVisible', payload: false }); // 关闭对话框
      yield put({ type: 'list', payload: { pageSize: PAGE_SIZE, pageNow: 1 } }); // 刷新表格
    },
    *list({ payload }, { call, put }) {
      yield put({ type: 'changeLoading', payload: true });
      const response = yield call(model.listModel, payload);
      yield put({ type: 'changeLoading', payload: false });
      if (response.code === 'error') { message.error(response.reason); return; }
      yield put({ type: 'changeModelTableData', payload: { ...response.content, pageNow: payload.pageNow } });
    },
    *listAll(_, { call, put }) {
      const response = yield call(model.listAllModel);
      if (response.code === 'error') { message.error(response.reason); return; }
      yield put({ type: 'changeModelSelectData', payload: response.content });
    },
    *get({ payload }, { call, put }) {
      const response = yield call(model.getModel, payload);
      if (response.code === 'error') { message.error(response.reason); return; }
      yield put({ type: 'changeCurModel', payload: response.content });
    },
    *getThenShowModifyModal({ payload, form }, { call, put }) {
      const response = yield call(model.getModel, payload);
      if (response.code === 'error') { message.error(response.reason); return; }
      yield put({ type: 'changeCurModel', payload: response.content });
      form.setFieldsValue({ name: response.content.name, file: response.content.file }); // 设置对话框的初始值
      yield put({ type: 'changeModifyModalVisible', payload: true }); // 打开对话框
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(model.deleteModel, payload);
      if (response.code === 'error') { message.error(response.reason); return; }
      message.success(response.reason);
      yield put({ type: 'list', payload: { pageSize: PAGE_SIZE, pageNow: 1 } }); // 刷新表格
    },
    *modify({ payload }, { call, put }) {
      yield put({ type: 'changeSubmitting', payload: true });
      const response = yield call(model.modifyModel, payload);
      yield put({ type: 'changeSubmitting', payload: false });
      if (response.code === 'error') { message.error(response.reason); return; }
      message.success(response.reason);
      yield put({ type: 'changeModifyModalVisible', payload: false }); // 关闭对话框
      yield put({ type: 'list', payload: { pageSize: PAGE_SIZE, pageNow: 1 } }); // 刷新表格
    },
  },

  reducers: {
    changeSubmitting(state, { payload }) {
      return { ...state, submitting: payload };
    },
    changeLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
    changeModelTableData(state, { payload }) {
      return { ...state, modelTableData: { list: payload.data, pagination: { ...state.modelTableData.pagination, current: payload.pageNow, total: payload.rowTotal } } };
    },
    changeModelSelectData(state, { payload }) {
      return { ...state, modelSelectData: payload };
    },
    changeCurModel(state, { payload }) {
      return { ...state, curModel: payload };
    },
    changeCurModelStatus(state, { payload }) {
      return { ...state, curModel: { ...state.curModel, status: payload } };
    },
    changeAddModalVisible(state, { payload }) {
      return { ...state, addModalVisible: payload };
    },
    changeModifyModalVisible(state, { payload }) {
      return { ...state, modifyModalVisible: payload };
    },
  },
};
