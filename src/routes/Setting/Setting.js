import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';

const { Description } = DescriptionList;

@connect(state => ({
  setting: state.setting,
}))
export default class Setting extends Component {
  componentDidMount() {
    this.props.dispatch({ type: 'setting/list' });
  }

  render() {
    const { settingData } = this.props.setting;
    return (
      <PageHeaderLayout title="系统配置" content="由超级管理员在本页面对系统环境进行配置。">
        <Card bordered={false}>
          <DescriptionList size="large" col="2" title="业务配置" style={{ marginBottom: 32 }}>
            <Description term="验证码长度">{settingData['captcha.len']}</Description>
            <Description term="验证码时效">{settingData['captcha.expire']} 秒</Description>
            <Description term="默认初始密码">{settingData['default.password']}</Description>
            <Description term="默认图像名称">{settingData['default.image']}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" col="2" title="认证配置" style={{ marginBottom: 32 }}>
            <Description term="token发行者">{settingData['token.issuer']}</Description>
            <Description term="token时效">{settingData['token.duration']} 毫秒</Description>
            <Description term="token私钥">{settingData['token.apiKeySecret']}</Description>
            <Description term="">&nbsp;</Description>
            <Description term="access_token发行者">{settingData['accesstoken.issuer']}</Description>
            <Description term="access_token时效">{settingData['accesstoken.duration']} 毫秒</Description>
            <Description term="access_token私钥">{settingData['accesstoken.apiKeySecret']}</Description>
            <Description term="refresh_token时效">{settingData['refreshtoken.duration']} 毫秒</Description>
            <Description term="refresh_token私钥">{settingData['refreshtoken.apiKeySecret']}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" col="2" title="数据库配置" style={{ marginBottom: 32 }}>
            <Description term="Redis服务IP">{settingData['redis.host']}</Description>
            <Description term="Redis服务端口">{settingData['redis.port']}</Description>
            <Description term="Redis密码">{settingData['redis.password']}</Description>
            <Description term="Redis最大空闲连接数">{settingData['redis.maxIdle']}</Description>
            <Description term="Redis最大激活连接数">{settingData['redis.maxActive']}</Description>
            <Description term="Redis最长等待时间">{settingData['redis.maxWait']}</Description>
            <Description term="Redis开启连接校验">{settingData['redis.testOnBorrow']}</Description>
            <Description term="">&nbsp;</Description>
            <Description term="MySQL驱动">{settingData['jdbc.driverClassName']}</Description>
            <Description term="MySQL服务地址">{settingData['jdbc.url'] ? settingData['jdbc.url'].substring(0, settingData['jdbc.url'].indexOf('?')) : ''}</Description>
            <Description term="MySQL用户名">{settingData['jdbc.username']}</Description>
            <Description term="MySQL密码">{settingData['jdbc.password']}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" col="2" title="中间件配置" style={{ marginBottom: 32 }}>
            <Description term="ZooKeeper服务地址">{settingData['zookeeper.host']}</Description>
            <Description term="Kafka集群地址">{settingData['kafka.brokerAddressList']}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" col="2" title="文件服务配置" style={{ marginBottom: 32 }}>
            <Description term="文件根目录">{settingData['file.path']}</Description>
            <Description term="头像目录">{settingData['file.avatarDic']}</Description>
            <Description term="应用LOGO目录">{settingData['file.appLogoDic']}</Description>
            <Description term="算法模型目录">{settingData['file.modelDic']}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" col="2" title="日志配置" style={{ marginBottom: 32 }}>
            <Description term="日志输出路径">{settingData['logback.filepath']}</Description>
            <Description term="日志队列容量">{settingData['logback.queueSize']} 字节</Description>
          </DescriptionList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
