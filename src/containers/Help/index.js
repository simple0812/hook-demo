import React from 'react';
import { Form, Row, Button, Col } from 'antd';
import _ from 'lodash';
import factory from './factory';

export default () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    let ret = {};
    _.keys(values).forEach((key) => {
      let xVal = values[key];
      if (!(_.isUndefined(xVal) || _.isNull(xVal) || _.isNaN(xVal))) {
        let xItem = formItemList.find((item) => item.key === key);
        if (xItem) {
          let xCtrlData = factory(xItem);

          if (
            xCtrlData &&
            xCtrlData.addon &&
            _.isFunction(xCtrlData.addon.convertViewToModel)
          ) {
            let tVal = xCtrlData.addon.convertViewToModel(xVal, {
              condition: ret,
              form,
              controlData: xCtrlData
            });
            if (!_.isUndefined(tVal)) {
              ret[key] = tVal;
            }
          } else {
            ret[key] = xVal;
          }
        } else {
          ret[key] = xVal;
        }
      }
    });

    console.log('ret', ret);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onValuesChange = (values) => {};

  const formItemList = [
    { key: 'name', label: '名称', fromItemProps: {}, controlProps: {} },
    { key: 'mobile', label: '手机号', control: 'number' },
    {
      key: 'address',
      label: '地址',
      control: 'select',
      fromItemProps: {},
      controlProps: {},
      options: {
        1: '北京',
        2: '上海',
        3: '武汉'
      }
    },
    { key: 'date', label: '活动日期', control: 'rangePicker' },
    { key: 'created_at', label: '开始时间', control: 'datePicker' }
  ];

  const __renderFormItem = () => {
    return formItemList.map((item) => {
      if (!item.fromItemProps) {
        item.fromItemProps = {};
      }

      if (!item.controlProps) {
        item.controlProps = {};
      }

      let ctrlData = factory(item);

      return (
        <Col span={6} style={{ paddingLeft: 5 }} key={item.key}>
          <Form.Item
            label={item.label}
            name={item.key}
            key={item.key}
            style={{ marginBottom: 10 }}
            {...item.fromItemProps}
            {...ctrlData.fromItemProps}>
            {React.createElement(ctrlData.control, {
              ...item.controlProps,
              ...ctrlData.controlProps
            })}
          </Form.Item>
        </Col>
      );
    });
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="horizontal"
      onFinish={onFinish}
      style={{
        padding: 10
      }}
      onValuesChange={onValuesChange}
      onFinishFailed={onFinishFailed}
      autoComplete="off">
      <Row>
        {__renderFormItem()}
        <Col
          span={6}
          style={{ paddingLeft: 5, display: 'flex', alignItems: 'center' }}>
          <Form.Item>
            <Button type="primary" ghost onClick={handleReset}>
              重置
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              style={{ margin: '0 5px' }}
              htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
