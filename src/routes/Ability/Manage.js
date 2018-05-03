import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, DatePicker } from 'antd';
import ManageTable from './ManageTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { PAGE_SIZE } from './../../common/config';

import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  ability: state.ability,
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
  handleAbilityListTableChange = (pageNow) => {
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
    this.props.dispatch({ type: 'ability/list', payload: params });
  }

  render() {
    const { ability, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <PageHeaderLayout
        title="能力列表"
        content="查看和管理本平台的能力。"
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 24 }}>
                  <Col md={6} sm={24}>
                    <FormItem>
                      {getFieldDecorator('zhName')(
                        <Input placeholder="能力中文名称" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={6} sm={24}>
                    <FormItem>
                      {getFieldDecorator('enName')(
                        <Input placeholder="能力英文名称" />
                      )}
                    </FormItem>
                  </Col>
                  <Col md={6} sm={24}>
                    <FormItem>
                      {getFieldDecorator('type')(
                        <Select placeholder="算法类型" style={{ width: '100%' }}>
                          <Option value="基础算法">基础算法</Option>
                          <Option value="模型算法">模型算法</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={6} sm={24}>
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
              <Button icon="plus" type="primary" onClick={() => this.props.dispatch(routerRedux.push('/ability/ability-creation'))}>
                新增能力
              </Button>
            </div>
            <ManageTable loading={ability.loading} data={ability.abilityTableData} onChange={this.handleAbilityListTableChange} dispatch={this.props.dispatch} />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
