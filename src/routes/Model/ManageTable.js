import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Divider, Modal } from 'antd';
import styles from './style.less';

export default class ListTable extends PureComponent {
  // 翻页
  handleTableChange = (pager) => {
    this.props.onChange(pager.current);
  }

  // 删除
  handleDelete = (id) => {
    Modal.confirm({
      title: '您确定要删除该算法模型吗?',
      content: '删除该条记录的同时将删除模型文件!',
      onOk: () => {
        this.props.dispatch({ type: 'model/delete', payload: { id } });
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
        title: '模型名称',
        dataIndex: 'name',
        width: '17%',
      },
      {
        title: '模型文件名',
        dataIndex: 'file',
        width: '17%',
      },
      {
        title: '模型容量',
        dataIndex: 'size',
        width: '14%',
        render: val => <span>{val === null ? '' : `${val} MB`}</span>,
      },
      {
        title: '更新时间',
        dataIndex: 'updateDate',
        width: '13%',
        sorter: (record1, record2) => (record1.updateDate - record2.updateDate),
        render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        width: '13%',
        sorter: (record1, record2) => (record1.createDate - record2.createDate),
        render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '操作',
        key: 'action',
        render: record => (
          <div>
            <a onClick={() => this.props.showUploadFileModal(record.id)}>上传</a>
            <Divider type="vertical" />
            <a onClick={() => this.props.showModifyModal(record)}>修改</a>
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
