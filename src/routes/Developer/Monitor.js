import React, { PureComponent } from 'react';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { DataSet } from '@antv/data-set';
import { connect } from 'dva';
import { Row, Col, Card, Form, Select, Button, DatePicker } from 'antd';
import { Chart, Axis, Tooltip, Geom, Legend } from 'bizcharts';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  developer: state.developer,
}))
@Form.create()
export default class Monitor extends PureComponent {
  state = {
    formValues: { abilityId: this.props.location.query && this.props.location.query.abilityId ? this.props.location.query.abilityId : -1 }, // 表单的筛选值
  };

  // 1.初始进入
  componentDidMount = () => {
    this.props.dispatch({ type: 'developer/listDeveloperApps', payload: { developerId: this.props.match.params.id } });
    this.props.dispatch({ type: 'developer/listDeveloperAbilities' });
    this.fetchTableData(this.state.formValues);
  }

  // 3.点击重置
  handleFormReset = () => {
    this.props.form.resetFields();
    this.fetchTableData({});
  }

  // 4.点击查询
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.fetchTableData(values);
    });
  }

  // ok:正式请求列表数据
  fetchTableData = (formValues) => {
    this.setState({ formValues });
    const invokeDateRange = formValues.invokeDate ? { invokeDateBegin: formValues.invokeDate[0], invokeDateEnd: formValues.invokeDate[1] } : {};
    this.props.dispatch({ type: 'developer/listAbilityInvokeLogStatistic', payload: { ...formValues, ...invokeDateRange, developerId: this.props.match.params.id } });
  }

  render() {
    const { developer, form } = this.props;
    const { getFieldDecorator } = form;
    const developerName = this.props.location.query ? this.props.location.query.developerName : '';
    // 筛选表单项
    const developerAppsOptions = developer.developerAppsData.map(record => <Option value={record.id} key={record.id}>{record.name}</Option>);
    const developerAbilitiesOptions = developer.developerAbilitiesData.map(record => <Option value={record.id} key={record.id}>{record.zhName}</Option>);

    // 图表数据
    const chartData = developer.abilityInvokeLogStatisticData.map(record => ({ day: moment(record.invokeDate).format('MM-DD'), '调用成功量': record.invokeSuccessCount, '调用失败量': record.invokeFailureCount }));
    const ds = new DataSet();
    const dv = ds.createView().source(chartData);
    dv.transform({
      type: 'fold',
      fields: ['调用成功量', '调用失败量'],
      key: 'invokeResult', // key字段
      value: 'invokeCount', // value字段
    });

    return (
      <PageHeaderLayout
        title="监控图表"
        content={<span>查看开发者&nbsp;<strong>{developerName}</strong>&nbsp;所有应用的能力调用情况的统计图表。</span>}
        action={<Button onClick={() => this.props.dispatch(routerRedux.push('/user/developer-manage'))}>返回开发者管理</Button>}
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 24 }}>
                  <Col md={8} sm={24}>
                    <FormItem>
                      {getFieldDecorator('appId', { initialValue: -1 })(
                        <Select placeholder="选择应用" style={{ width: '100%' }}>
                          <Option value={-1}>全部应用</Option>
                          {developerAppsOptions}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                    <FormItem>
                      {getFieldDecorator('abilityId', { initialValue: this.state.formValues.abilityId })(
                        <Select placeholder="选择能力" style={{ width: '100%' }}>
                          <Option value={-1}>全部能力</Option>
                          {developerAbilitiesOptions}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                    <FormItem>
                      {getFieldDecorator('invokeDate')(
                        <DatePicker.RangePicker />
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
            <div className={styles.tableListOperator} />
          </div>
          <Chart height={400} data={dv} scale={{ day: { range: [0, 1] } }} forceFit>
            <Axis name="day" />
            <Axis name="invokeCount" label={{ formatter: val => `${val} 次` }} />
            <Legend />
            <Tooltip crosshairs={{ type: 'y' }} />
            <Geom type="line" position="day*invokeCount" size={2} color="invokeResult" shape="smooth" />
            <Geom type="point" position="day*invokeCount" size={4} shape="circle" color="invokeResult" style={{ stroke: '#fff', lineWidth: 1 }} />
          </Chart>
          <Chart height={400} data={dv} forceFit>
            <Axis name="day" />
            <Axis name="invokeCount" label={{ formatter: val => `${val} 次` }} />
            <Legend />
            <Tooltip crosshairs={{ type: 'y' }} />
            <Geom type="intervalStack" position="day*invokeCount" color="invokeResult" style={{ stroke: '#fff', lineWidth: 1 }} />
          </Chart>
        </Card>
        {/* <Card bordered={false} bodyStyle={{ padding: '32px 32px 32px 32px' }} style={{ marginTop: 32 }}>
          <MonitorTable loading={developer.loading} data={developer.abilityInvokeLogStatisticData} onChange={this.handleMonitorTableChange} dispatch={this.props.dispatch} invokeResultFilter={this.state.invokeResultFilter} />
        </Card> */}
      </PageHeaderLayout>
    );
  }
}
