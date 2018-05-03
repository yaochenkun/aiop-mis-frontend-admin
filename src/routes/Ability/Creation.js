import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Col, Row, Input, Select, Popover, Radio, Modal } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FooterToolbar from '../../components/FooterToolbar';
import styles from './style.less';
import { REGEX } from './../../common/regex';

const { Option } = Select;


const fieldLabels = {
  zhName: '中文名称',
  enName: '英文名称',
  description: '能力描述',
  restapiUrl: '调用地址',
  docUrl: '文档地址',
  type: '算法类别',
  modelId: '算法模型',
  invokeLimit: '初始调用量限制',
  qpsLimit: '初始QPS限制',
  version: '版本号',
};

@connect(state => ({
  collapsed: state.global.collapsed,
  ability: state.ability,
  model: state.model,
}))
@Form.create()
export default class AdvancedForm extends PureComponent {
  state = {
    modelIdSelectDisabled: true,
  }

  // 拉取所有模型放入下拉列表中
  componentDidMount = () => {
    this.props.dispatch({ type: 'model/listAll' });
  }

  render() {
    const { ability, model, form, dispatch } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const handleSubmit = () => {
      validateFieldsAndScroll((error) => {
        if (!error) showSubmitConfirm();
      });
    };
    const showSubmitConfirm = () => {
      Modal.confirm({
        title: '请再次核对能力信息填写是否正确?',
        content: '能力新增成功后将无法再次修改名称与描述',
        onOk() {
          validateFieldsAndScroll((error, values) => {
            if (!error) {
              dispatch({ type: 'ability/add', payload: { ...values, invokeLimit: Number(values.invokeLimit), qpsLimit: Number(values.qpsLimit) } });
            }
          });
        },
      });
    };
    const changeModelType = (e) => {
      const type = e.target.value;
      if (type === '模型算法') {
        this.setState({ modelIdSelectDisabled: false });
      } else {
        this.setState({ modelIdSelectDisabled: true });
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

    // 构建模型下拉列表
    const modelOptions = model.modelSelectData.map(record => <Option value={record.id} key={record.id}>{record.name}</Option>);
    return (
      <PageHeaderLayout
        title="新增能力"
        content="由管理员向本平台新增能力，为开发者提供更多丰富的调用接口。"
        wrapperClassName={styles.advancedForm}
      >
        <Card title="能力信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={24}>
              <Col lg={12} md={14} sm={24}>
                <Form.Item label={fieldLabels.zhName}>
                  {getFieldDecorator('zhName', { rules: [{ required: true, message: '请填写中文名称' }] })(
                    <Input placeholder="请输入中文名称" />
                  )}
                </Form.Item>
              </Col>
              <Col lg={12} md={14} sm={24}>
                <Form.Item label={fieldLabels.enName}>
                  {getFieldDecorator('enName', { rules: [{ required: true, message: '请填写英文名称' }] })(
                    <Input placeholder="请输入英文名称" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col lg={24} md={12} sm={24}>
                <Form.Item label={fieldLabels.description}>
                  {getFieldDecorator('description', { rules: [{ required: true, message: '请填写能力描述' }] })(
                    <Input.TextArea placeholder="简单描述一下该能力，如通过词向量模型计算两个短文本的相似度，请控制在500字以内" rows={5} style={{ resize: 'none' }} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card title="能力配置" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={24}>
              <Col lg={12} md={14} sm={24}>
                <Form.Item label={fieldLabels.restapiUrl}>
                  {getFieldDecorator('restapiUrl', { rules: [{ required: true, message: '请填写调用地址' }] })(
                    <Input placeholder="请输入调用地址" />
                  )}
                </Form.Item>
              </Col>
              <Col lg={12} md={14} sm={24}>
                <Form.Item label={fieldLabels.docUrl}>
                  {getFieldDecorator('docUrl', { rules: [{ required: true, message: '请填写文档地址' }] })(
                    <Input placeholder="请输入文档地址" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={6} md={14} sm={24}>
                <Form.Item label={fieldLabels.type}>
                  {getFieldDecorator('type', { rules: [{ required: true, message: '请选择类别' }], initialValue: '基础算法' })(
                    <Radio.Group onChange={changeModelType}>
                      <Radio.Button value="基础算法">基础算法</Radio.Button>
                      <Radio.Button value="模型算法">模型算法</Radio.Button>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={14} sm={24}>
                <Form.Item label={fieldLabels.modelId}>
                  {getFieldDecorator('modelId', { rules: [{ required: true, message: '请选择算法模型' }], initialValue: model.modelSelectData.length > 0 ? model.modelSelectData[0].id : -1 })(
                    <Select placeholder="请选择模型" disabled={this.state.modelIdSelectDisabled}>
                      {modelOptions}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={12} md={14} sm={24}>
                <Form.Item label={fieldLabels.version}>
                  {getFieldDecorator('version', { rules: [{ required: true, message: '请填写版本号' }] })(
                    <Input placeholder="请输入版本号" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={12} md={14} sm={24}>
                <Form.Item label={fieldLabels.invokeLimit}>
                  {getFieldDecorator('invokeLimit', { rules: [{ required: true, message: '请填写初始调用量限制' }, { pattern: REGEX.POSITIVE_INT_NUMBER, message: '请输入正整数！' }] })(
                    <Input placeholder="请输入初始调用量限制" addonAfter="次 / 天" />
                  )}
                </Form.Item>
              </Col>
              <Col lg={12} md={14} sm={24}>
                <Form.Item label={fieldLabels.qpsLimit}>
                  {getFieldDecorator('qpsLimit', { rules: [{ required: true, message: '请填写初始QPS限制' }, { pattern: REGEX.POSITIVE_INT_NUMBER, message: '请输入正整数！' }] })(
                    <Input placeholder="请输入初始QPS限制" addonAfter="请求 / 秒" />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <FooterToolbar>
          {getErrorInfo()}
          <Button type="primary" onClick={handleSubmit} loading={ability.submitting}>
            确认新增
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
