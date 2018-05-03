import React, { PureComponent } from 'react';
import moment from 'moment';
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
      title: '您确定要删除该能力吗?',
      content: '删除该能力后将无法恢复!',
      onOk: () => {
        this.props.dispatch({ type: 'ability/delete', payload: { id } });
      },
    });
  }

  render() {
    const { data, loading } = this.props;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 70,
        fixed: 'left',
        sorter: (record1, record2) => (record1.id - record2.id),
      },
      {
        title: '中文名称',
        dataIndex: 'zhName',
        width: '10%',
      },
      {
        title: '英文名称',
        dataIndex: 'enName',
        width: '10%',
      },
      {
        title: '算法类型',
        dataIndex: 'type',
        width: '10%',
      },
      {
        title: '调用地址',
        dataIndex: 'restapiUrl',
        width: '18%',
        render: val => <a>{val}</a>,
      },
      {
        title: '调用量限制',
        dataIndex: 'invokeLimit',
        width: '10%',
        className: styles.columnAlignRight,
        render: val => <span>{`${val} 次/天`}</span>,
      },
      {
        title: 'QPS限制',
        dataIndex: 'qpsLimit',
        width: '10%',
        className: styles.columnAlignRight,
        render: val => <span>{`${val} 请求/秒`}</span>,
      },
      {
        title: '版本',
        dataIndex: 'version',
        width: '10%',
      },
      {
        title: '更新时间',
        dataIndex: 'updateDate',
        width: 110,
        fixed: 'right',
        sorter: (record1, record2) => (record1.updateDate - record2.updateDate),
        render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 150,
        render: record => (
          <div>
            <Link to={`/ability/ability-profile/${record.id}`}>管理</Link>
            <Divider type="vertical" />
            <Link to={record.docUrl}>文档</Link>
            <Divider type="vertical" />
            <a className={styles.delete} onClick={() => this.handleDelete(record.id)}>删除</a>
          </div>
        ),
      },
    ];

    return (
      <div className={styles.standardTable}>
        <Table
          scroll={{ x: '150%' }}
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
