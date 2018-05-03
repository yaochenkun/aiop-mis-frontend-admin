import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Table, Divider, Modal } from 'antd';
import styles from './style.less';

export default class ManageTable extends PureComponent {
  // 翻页
  handleTableChange = (pager) => {
    this.props.onChange(pager.current);
  }

  // 删除
  handleDelete = (id) => {
    Modal.confirm({
      title: '您确定要删除该开发者吗?',
      content: '删除该开发者后将无法恢复!',
      onOk: () => {
        this.props.dispatch({ type: 'developer/delete', payload: { id } });
      },
    });
  }

  render() {
    const { data, loading } = this.props;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        width: '9%',
        sorter: (record1, record2) => (record1.id - record2.id),
      },
      {
        title: '用户名',
        dataIndex: 'username',
        width: '20%',
      },
      {
        title: '注册邮箱',
        dataIndex: 'email',
        width: '25%',
      },
      {
        title: '注册手机',
        dataIndex: 'mobile',
        width: '20%',
      },
      {
        title: '操作',
        key: 'action',
        render: record => (
          <div>
            <Link to={{ pathname: `/user/developer-app-manage/${record.id}`, query: { developerName: record.username } }}>应用管理</Link>
            <Divider type="vertical" />
            <Link to={{ pathname: `/user/developer-app-monitor/${record.id}`, query: { developerName: record.username } }}>监控图表</Link>
            <Divider type="vertical" />
            <a className={styles.delete} onClick={() => this.handleDelete(record.id)}>删除</a>
          </div>
        ),
      },
    ];

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          dataSource={data.list}
          columns={columns}
          pagination={data.pagination}
          onChange={this.handleTableChange}
          rowKey={record => record.id}
        />
      </div>
    );
  }
}
