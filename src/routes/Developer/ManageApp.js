import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Button, DatePicker } from 'antd';
import ManageTableApp from './ManageTableApp';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { PAGE_SIZE } from './../../common/config';

import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;


@connect(state => ({
  developer: state.developer,
}))
@Form.create()
export default class Manage extends PureComponent {
  state = {
    formValues: {}, // 表单的筛选值
  };

  // 1.初始进入
  componentDidMount = () => {
    this.fetchTableData(1, this.state.formValues);
  }

  // 2.点击翻页
  handleAppListTableChange = (pageNow) => {
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
    const developerId = this.props.match.params.id;
    const params = { pageSize: PAGE_SIZE, pageNow, developerId, ...formValues };
    this.props.dispatch({ type: 'developer/listAppUnderDeveloper', payload: params });
  }

  render() {
    const { developer, form } = this.props;
    const { getFieldDecorator } = form;
    const developerId = this.props.match.params.id;
    const developerName = this.props.location.query ? this.props.location.query.developerName : '';
    return (
      <PageHeaderLayout
        title="应用列表"
        content={<span>查看开发者&nbsp;<strong>{developerName}</strong>&nbsp;所创建的应用</span>}
        action={<Button onClick={() => this.props.dispatch(routerRedux.push('/user/developer-manage'))}>返回开发者管理</Button>}
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={24}>
                    <FormItem>
                      {getFieldDecorator('name')(
                        <Input placeholder="应用名称" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                    <FormItem>
                      {getFieldDecorator('status')(
                        <Select placeholder="状态" style={{ width: '100%' }}>
                          <Option value="关闭">关闭</Option>
                          <Option value="运行中">运行中</Option>
                          <Option value="已上线">已上线</Option>
                          <Option value="异常">异常</Option>
                        </Select>
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
                  <Col md={24} sm={24} style={{ textAlign: 'right', marginBottom: 20 }}>
                    <span className={styles.submitButtons}>
                      <Button type="primary" htmlType="submit">查询</Button>
                      <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                    </span>
                  </Col>
                </Row>
              </Form>
            </div>

            <ManageTableApp loading={developer.loading} data={developer.appTableData} developer={developerId} developerName={developerName} onChange={this.handleAppListTableChange} dispatch={this.props.dispatch} />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
