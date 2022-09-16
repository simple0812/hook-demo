import React, { Component } from 'react';
import { Checkbox, Button, message } from 'antd';
import cn from 'classnames';
import _ from 'lodash';

class ColumnManager extends Component {
  constructor(props) {
    super(props);

    const datasource = props.datasource || [];
    let selectedColumns = [];

    if (props.autoSetColumnTableName) {
      try {
        let xkey = `${props.autoSetColumnTableName}_COLUMN_SHOW_${_.get(
          window.config,
          'userName',
          ''
        )}`;
        selectedColumns = JSON.parse(localStorage.getItem(xkey)) || [];
      } catch (e) {}
    }

    this.state = {
      selectedColumns,
      datasource
    };
  }

  componentWillUpdate(nextProps) {
    if (nextProps.datasource !== this.props.datasource) {
      this.setState({
        datasource: nextProps.datasource
      });
    }
  }

  handleSubmit = () => {
    const { datasource, selectedColumns } = this.state;
    // if (_.isEmpty(selectedColumns)) {
    //   return message.warning('至少要显示一列');
    // }
    const { onSubmit } = this.props;
    if (_.isFunction(onSubmit)) {
      try {
        if (this.props.autoSetColumnTableName) {
          let xkey = `${this.props.autoSetColumnTableName}_COLUMN_SHOW_${_.get(
            window.config,
            'userName',
            ''
          )}`;

          if (_.isEmpty(selectedColumns)) {
            localStorage.removeItem(xkey);
          } else {
            localStorage.setItem(xkey, JSON.stringify(selectedColumns));
          }
        }
      } catch (e) {}
      onSubmit(selectedColumns);
    }
  };

  handleToggleCheck = (col) => {
    const { selectedColumns } = this.state;
    let xIndex = selectedColumns.indexOf(col.key);
    if (xIndex >= 0) {
      selectedColumns.splice(xIndex, 1);
    } else {
      selectedColumns.push(col.key);
    }
    this.setState({
      selectedColumns
    });
  };

  render() {
    const { datasource = [], selectedColumns } = this.state;
    const { loading, sortable } = this.props;

    return (
      <div style={{ width: '200px' }}>
        <ul style={{ maxHeight: '500px', overflow: 'auto' }}>
          {datasource.map((each) => (
            <li
              key={each.key}
              style={{
                margin: '10px 0',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
              }}
            >
              <Checkbox
                checked={selectedColumns.indexOf(each.key) >= 0}
                onClick={this.handleToggleCheck.bind(this, each)}
              >
                {each.title}
              </Checkbox>
            </li>
          ))}
        </ul>
        <Button
          loading={loading === 'pending'}
          onClick={this.handleSubmit}
          style={{ width: '100%' }}
        >
          保存配置
        </Button>
      </div>
    );
  }
}

export default ColumnManager;
