import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'antd';
import BaseDetailPage from '@/magicPackages/BaseDetailPage';

@inject((store) => {
  return {
    currStore: store.globalStore,
    globalLoading: store.globalStore.globalLoading
  };
})
@observer
class PageDetail extends BaseDetailPage {
  constructor(props) {
    super(props, {});
    this.state = {};
    this.store = props.currStore;

    /*编辑控件数据源*/
    this.editorData = {
      data: {
        $group: {
          control: 'zone',
          label: '基本信息',
          children: {
            tag2: '编号',
            tag3: '方案来源',
            tag5: '意向单号',
            tag16: '客户姓名',
            tag6: '方案名称',
            tag17: '楼盘名称',
            tag18: '所属门店',
            tag7: {
              label: '门店名称',
              getInitialValue: () => '123'
            },
            tag8: {
              label: '门店类型',
              control: 'metaSelect',
              controlProps: {
                labelKey: 'tag6',
                httpMethod: 'post',
                apiUrl: '/solution/queryPageList.do'
              }
            },
            tag9: '区域',
            tag10: '选择产品',
            tag19: '户型布置图',
            tag20: '风格',
            tag21: '全景图地址'
          }
        },
        $group1: {
          control: 'zone',
          label: '户型信息',
          children: {
            tag22: '户型结构',
            tag23: '测量面积',
            tag24: '计价面积',
            tag25: '层高',
            tag26: '卫生间数量',
            tag27: '是否有电梯',
            tag28: '配送距离'
          }
        },
        $group2: {
          control: 'zone',
          label: '基础价',
          children: {
            jc1: '原基础价',
            jc2: '减基础价',
            jc3: '基础价'
          }
        },
        $group3: {
          control: 'zone',
          label: '个性化费用',
          children: {
            gx1: '材料增项/增量费用 包含主材绑定的施工项金额',
            gx2: '施工增项/增量费用 单独施工项的金额（不含绑定主材的施工项）'
          }
        },
        $group4: {
          control: 'zone',
          label: '其他费用',
          children: {
            qt1: '无电梯搬运费',
            qt2: '远程配送费',
            qt3: '基础合同价',
            qt4: '管理费点(%)',
            qt5: '管理费',
            qt6: '税率(%)',
            qt7: '税金',
            qt8: '管理费剩余额度 '
          }
        },
        $group5: {
          control: 'zone',
          label: '方案总报价',
          children: {
            zong1: '优惠金额',
            zong2: '方案总报价'
          }
        },
        $group6: {
          control: 'zone',
          label: '扩展信息',
          children: {
            kz1: '客户经理',
            kz2: '设计师',
            kz3: '上架状态',
            kz4: '合同签约状态',
            kz5: '创建用户',
            kz6: '创建时间',
            kz7: '修改用户',
            kz8: '修改日期',
            kz9: '优惠金额',
            kz10: '审批状态'
          }
        }
      },
      saveHidden: true,
      closeHidden: true,
      formItemProps: {
        labelCol: {
          xs: { span: 6 },
          sm: { span: 6 },
          lg: { span: 6 },
          xl: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 17 },
          sm: { span: 17 },
          lg: { span: 17 },
          xl: { span: 17 }
        }
      },
      methods: {
        beforeSubmit: (params) => {
          return '';
        }
      },

      extraButtons: (
        <>
          <Button onClick={this.test} style={{ margin: '0 5px' }}>
            多开
          </Button>
          <Button onClick={this.reset} style={{ margin: '0 5px' }}>
            刷新
          </Button>
          <Button style={{ margin: '0 5px' }}>复制</Button>
          <Button
            onClick={() => this.setState({ caseDrawerVisible: true })}
            style={{ margin: '0 5px' }}>
            做方案
          </Button>
        </>
      )
    };
  }

  test = () => {
    this.$editorRef.handleSubmit();

  };

  reset = () => {
    this.$editorRef.handleReset();
  }

  renderExtra = () => {
    const { caseDrawerVisible } = this.state;
    return '';
  };
}

export default PageDetail;
