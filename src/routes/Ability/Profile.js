import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Card, Form, Col, Row, Input, Radio, Select, Icon, Popover, Modal } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import FooterToolbar from './../../components/FooterToolbar';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './style.less';
import { FILE_SERVER } from './../../common/config';
import { REGEX } from './../../common/regex';

const { Option } = Select;

const { Description } = DescriptionList;
const fieldLabels = {
  restapiUrl: '调用地址',
  docUrl: '文档地址',
  type: '算法类别',
  modelId: '算法模型',
  invokeLimit: '初始调用量限制',
  qpsLimit: '初始QPS限制',
  version: '版本号',
};

@connect(state => ({
  ability: state.ability,
  model: state.model,
}))
@Form.create()
export default class AdvancedProfile extends Component {
  // 拉取应用信息
  componentDidMount() {
    // 获取路由中的当前应用id
    const abilityId = this.props.match.params.id;
    this.props.dispatch({ type: 'ability/getThenSetModelIdSelectDisabled', payload: { id: abilityId } });
    this.props.dispatch({ type: 'model/listAll' });
  }

  render() {
    const { ability, model, form, dispatch } = this.props;
    const { curAbility } = ability; console.log(curAbility);
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const handleSubmit = () => {
      validateFieldsAndScroll((error) => {
        if (!error) showSubmitConfirm();
      });
    };
    const showSubmitConfirm = () => {
      Modal.confirm({
        title: '您确定要更新该能力的配置吗?',
        content: '更新后新创建的应用将以新配置作为参数',
        onOk: () => {
          validateFieldsAndScroll((error, values) => {
            if (!error) {
              const abilityId = this.props.match.params.id;
              dispatch({ type: 'ability/update', payload: { ...values, id: abilityId, invokeLimit: Number(values.invokeLimit), qpsLimit: Number(values.qpsLimit) } });
            }
          });
        },
      });
    };
    const changeModelType = (e) => {
      const type = e.target.value;
      if (type === '模型算法') {
        dispatch({ type: 'ability/changeModelIdSelectDisabled', payload: false });
      } else {
        dispatch({ type: 'ability/changeModelIdSelectDisabled', payload: true });
      }
    };

    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = (fieldKey) => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map((key) => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };

    const description = (
      <DescriptionList className={styles.headerList} size="small" col="1">
        <Description term="英文名称">{curAbility.enName}</Description>
        <Description term="能力描述">{curAbility.description}</Description>
        <Description term="算法类别">{`${curAbility.type}${curAbility.type === '模型算法' ? `（${curAbility.model.name}）` : ''}`}</Description>
        <Description term="调用地址"><a>{curAbility.restapiUrl}</a></Description>
        <Description term="文档地址"><Link to={curAbility.docUrl === undefined ? '/' : curAbility.docUrl}>{curAbility.docUrl}</Link></Description>
        <Description term="初始调用量限制">{`${curAbility.invokeLimit} 次 / 天`}</Description>
        <Description term="初始QPS限制">{`${curAbility.qpsLimit} 请求 / 秒`}</Description>
        <Description term="版本">{curAbility.version}</Description>
        <Description term="创建日期">{moment(curAbility.createDate).format('YYYY-MM-DD')}</Description>
        <Description term="更新日期">{moment(curAbility.updateDate).format('YYYY-MM-DD')}</Description>
      </DescriptionList>
    );

    // 构建模型下拉列表
    const modelOptions = model.modelSelectData.map(record => <Option value={record.id} key={record.id}>{record.name}</Option>);
    return (
      <PageHeaderLayout
        title={`能力：${curAbility.zhName}`}
        logo={<img alt="" src={`${FILE_SERVER}/app_logo/default.png`} />}
        action={<Button onClick={() => this.props.dispatch(routerRedux.push('/ability/ability-manage'))}>返回能力列表</Button>}
        content={description}
      >
        <Card title="能力配置更新" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={24}>
              <Col lg={12} md={14} sm={24}>
                <Form.Item label={fieldLabels.restapiUrl}>
                  {getFieldDecorator('restapiUrl', { rules: [{ required: true, message: '请填写调用地址' }], initialValue: curAbility.restapiUrl })(
                    <Input placeholder="请输入调用地址" />
                  )}
                </Form.Item>
              </Col>
              <Col lg={12} md={14} sm={24}>
                <Form.Item label={fieldLabels.docUrl}>
                  {getFieldDecorator('docUrl', { rules: [{ required: true, message: '请填写文档地址' }], initialValue: curAbility.docUrl })(
                    <Input placeholder="请输入文档地址" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={6} md={14} sm={24}>
                <Form.Item label={fieldLabels.type}>
                  {getFieldDecorator('type', { rules: [{ required: true, message: '请选择类别' }], initialValue: curAbility.type })(
                    <Radio.Group onChange={changeModelType}>
                      <Radio.Button value="基础算法">基础算法</Radio.Button>
                      <Radio.Button value="模型算法">模型算法</Radio.Button>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={14} sm={24}>
                <Form.Item label={fieldLabels.modelId}>
                  {getFieldDecorator('modelId', { rules: [{ required: true, message: '请选择算法模型' }], initialValue: curAbility.model ? curAbility.model.id : (model.modelSelectData.length > 0 ? model.modelSelectData[0].id : '') })(
                    <Select placeholder="请选择模型" disabled={ability.modelIdSelectDisabled}>
                      {modelOptions}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={12} md={14} sm={24}>
                <Form.Item label={fieldLabels.version}>
                  {getFieldDecorator('version', { rules: [{ required: true, message: '请填写版本号' }], initialValue: curAbility.version })(
                    <Input placeholder="请输入版本号" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12} md={14} sm={24}>
                <Form.Item label={fieldLabels.invokeLimit}>
                  {getFieldDecorator('invokeLimit', { rules: [{ required: true, message: '请填写初始调用量限制' }, { pattern: REGEX.POSITIVE_INT_NUMBER, message: '请输入正整数！' }], initialValue: curAbility.invokeLimit })(
                    <Input placeholder="请输入初始调用量限制" addonAfter="次 / 天" />
                  )}
                </Form.Item>
              </Col>
              <Col lg={12} md={14} sm={24}>
                <Form.Item label={fieldLabels.qpsLimit}>
                  {getFieldDecorator('qpsLimit', { rules: [{ required: true, message: '请填写初始QPS限制' }, { pattern: REGEX.POSITIVE_INT_NUMBER, message: '请输入正整数！' }], initialValue: curAbility.qpsLimit })(
                    <Input placeholder="请输入初始QPS限制" addonAfter="请求 / 秒" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <FooterToolbar extra="提示信息">
              {getErrorInfo()}
              <Button type="primary" onClick={handleSubmit} loading={ability.submitting}>
                提交更新
              </Button>
            </FooterToolbar>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
