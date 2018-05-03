import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, DatePicker } from 'antd';
import ManageTable from './ManageTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { PROXY_SERVER, PAGE_SIZE } from './../../common/config';
import AddModal from './AddModal';
import ModifyModal from './ModifyModal';
import UploadFileModal from './../../components/UploadFileModal';
import styles from './style.less';

const FormItem = Form.Item;

@connect(state => ({
  model: state.model,
}))
@Form.create()
export default class Manage extends PureComponent {
  state = {
    formValues: {}, // 表单的筛选值

    uploadFileModalVisible: false,
    curModelId: -1,
  };

  // 1.初始进入
  componentDidMount = () => {
    this.fetchTableData(1, this.state.formValues);
  }

  // 2.点击翻页
  handleModelListTableChange = (pageNow) => {
    this.fetchTableData(pageNow, this.state.formValues);
  }

  // 3.点击重置
  handleFormReset = () => {
    this.props.form.resetFields();
    this.fetchTableData(1, {});
  }

  // 4.点击查询
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.fetchTableData(1, values);
    });
  }

  // ok:正式请求列表数据
  fetchTableData = (pageNow, formValues) => {
    this.setState({ formValues });
    const params = { pageSize: PAGE_SIZE, pageNow, ...formValues };
    this.props.dispatch({ type: 'model/list', payload: params });
  }

  // 1.添加对话框
  showAddModal = () => {
    this.props.dispatch({ type: 'model/changeAddModalVisible', payload: true });
  }
  okAddModal = (values) => {
    this.props.dispatch({ type: 'model/add', payload: values });
  }
  cancelAddModal = () => {
    this.props.dispatch({ type: 'model/changeAddModalVisible', payload: false });
  }

  // 2.修改对话框
  showModifyModal = (record) => {
    this.refs.modifyForm.setFieldsValue({ name: record.name, file: record.file }); // 设置对话框的初始值
    this.props.dispatch({ type: 'model/changeCurModel', payload: record }); // 设置当前模型
    this.props.dispatch({ type: 'model/changeModifyModalVisible', payload: true }); // 显示
  }
  okModifyModal = (values) => {
    this.props.dispatch({ type: 'model/modify', payload: { ...values, id: this.props.model.curModel.id } });
  }
  cancelModifyModal = () => {
    this.props.dispatch({ type: 'model/changeModifyModalVisible', payload: false });
  }

  // 3.上传模型文件对话框
  showUploadFileModal = (id) => {
    this.setState({ uploadFileModalVisible: true, curModelId: id });
  }
  okUploadFileModal = () => {
    this.setState({ uploadFileModalVisible: false });
    this.fetchTableData(1, this.state.formValues);
  }
  cancelUploadFileModal = () => {
    this.setState({ uploadFileModalVisible: false });
  }

  render() {
    const { model, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <PageHeaderLayout
        title="模型列表"
        content="由管理员查看和管理本平台的算法模型文件。"
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={24}>
                    <FormItem>
                      {getFieldDecorator('name')(
                        <Input placeholder="模型名称" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                    <FormItem>
                      {getFieldDecorator('file')(
                        <Input placeholder="模型文件名" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                    <FormItem>
                      {getFieldDecorator('updateDate')(
                        <DatePicker style={{ width: '100%' }} placeholder="更新日期" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={24} sm={24} style={{ textAlign: 'right' }}>
                    <span className={styles.submitButtons}>
                      <Button type="primary" htmlType="submit">查询</Button>
                      <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                    </span>
                  </Col>
                </Row>
              </Form>
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.showAddModal}>
                新增模型
              </Button>
              <AddModal
                title="新增模型"
                visible={model.addModalVisible}
                onOk={this.okAddModal}
                onCancel={this.cancelAddModal}
                confirmLoading={model.submitting}
              />
            </div>
            <ManageTable
              loading={model.loading}
              data={model.modelTableData}
              onChange={this.handleModelListTableChange}
              dispatch={this.props.dispatch}
              showModifyModal={this.showModifyModal}
              showUploadFileModal={this.showUploadFileModal}
            />
            <ModifyModal
              ref="modifyForm"
              title="修改模型"
              visible={model.modifyModalVisible}
              onOk={this.okModifyModal}
              onCancel={this.cancelModifyModal}
              confirmLoading={model.submitting}
            />
            <UploadFileModal
              title="上传模型文件"
              visible={this.state.uploadFileModalVisible}
              onOk={this.okUploadFileModal}
              onCancel={this.cancelUploadFileModal}
              params={{ id: this.state.curModelId, token: sessionStorage.getItem('token'), url: `${PROXY_SERVER}/api/model/file` }}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
