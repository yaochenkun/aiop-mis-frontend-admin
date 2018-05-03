import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button } from 'antd';
import ManageTable from './ManageTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { PAGE_SIZE } from './../../common/config';

import styles from './style.less';

const FormItem = Form.Item;

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
    const params = { pageSize: PAGE_SIZE, pageNow, ...formValues };
    this.props.dispatch({ type: 'developer/list', payload: params });
  }

  render() {
    const { developer, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <PageHeaderLayout
        title="开发者列表"
        content="查看和管理开放平台中已注册的开发者。"
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={24}>
                    <FormItem>
                      {getFieldDecorator('username')(
                        <Input placeholder="开发者用户名" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                    <FormItem>
                      {getFieldDecorator('email')(
                        <Input placeholder="开发者邮箱" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                    <FormItem>
                      {getFieldDecorator('mobile')(
                        <Input placeholder="开发者手机" />
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
            <ManageTable loading={developer.loading} data={developer.appTableData} onChange={this.handleAppListTableChange} dispatch={this.props.dispatch} />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
