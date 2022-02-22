import React, { Component } from 'react';
import styles from './index.less';
import { Button, Icon, AutoComplete, Input } from 'antd';
import _ from 'lodash';
import { debounce } from 'lodash-decorators';
import SuccessSvg from './assets/success_fill.svg';
import DeleteSvg from './assets/delete_fill.svg';
import MapIcon from './assets/icon_map.svg';
import MapDot from './assets/map-dot.png';

const { Option } = AutoComplete;
class YLMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchRes: [],
      value: undefined
    };
    this.marker = null;
  }

  componentDidMount() {
    this.map = new window.YunliMap.Map({
      container: 'mapContainer',
      layers: ['tianditu', 'tianditu_anno'],
      zoom: 13,
      zooms: [10, 18],
      center: [116.3911, 39.9074600000001]
    });
    this.map.on('click', (e) => {
      this.addMarker(e.position);

      window.YunliMap.getAddress(
        {
          coordinate: e.position, //经纬度
          inputType: 'gps' //支持类型gps, gcj02, baidu
        },
        (address) => {
          this.setState({
            value: address,
            selectItem: {
              name: '',
              address,
              coordinate: e.position
            }
          });
        }
      );
    });
  }

  @debounce(200)
  handleSearch = (keyword) => {
    if (keyword) {
      window.YunliMap.searchPOI(
        {
          keyword
        },
        (res) => {
          if (!res || _.isEmpty(res)) {
            return;
          }

          res = res.map((item) => {
            item.id =
              item.name + '_' + item.coordinate[0] + '_' + item.coordinate[1]; // _.uniqueId('map_poi_');
            return item;
          });
          this.setState({
            searchRes: res
          });
        }
      );
    } else {
      this.setState({ searchRes: [] });
    }
  };

  handleChange = (value) => {
    this.setState({ value });
  };

  addMarker = (coordinate) => {
    if (this.marker) {
      //清除上一次点击添加的标记
      this.marker.removeTo(this.map);
    }
    this.marker = new window.YunliMap.Marker({
      //添加标记
      icon: MapDot,
      position: coordinate,
      offset: [-10, -28],
      draggable: true
    });

    if (this.infoWindow) {
      // 不能删除 否则 public-sentiment 元素会被移除 导致报错
      // this.infoWindow.removeTo(this.map);
      this.infoWindow.setPosition(coordinate);
      this.infoWindow.hide();
    } else {
      this.infoWindow = new window.YunliMap.InfoWindow({
        content: document.getElementById('public-sentiment'),
        position: coordinate,
        offset: [0, -30, 0, 40], //偏移量
        hasAngle: false
      });

      this.infoWindow.hide();
      this.infoWindow.addTo(this.map);
    }

    this.marker.addTo(this.map);
    // this.map.fit({
    //   feature: this.marker
    // });
    this.marker.on('dragend', (e) => {
      const coordinate = this.marker.getPosition();
      if (this.infoWindow) {
        this.infoWindow.setPosition(coordinate);
        this.infoWindow.show();
      }
      window.YunliMap.getAddress(
        {
          coordinate: coordinate, //经纬度
          inputType: 'gps' //支持类型gps, gcj02, baidu
        },
        (address, zz) => {
          this.setState({
            value: address,
            selectItem: {
              name: '',
              address,
              coordinate
            }
          });
        }
      );
    });
    this.marker.on('mouseenter', () => {
      if (this.infoWindow) {
        this.infoWindow.show();
      }
    });

    this.marker.on('mouseleave', () => {
      if (this.infoWindow) {
        this.infoWindow.hide();
      }
    });
  };

  handleSelect = (value) => {
    const { searchRes = [] } = this.state;

    const selectItem = searchRes.find((item) => item.id === value);
    this.map.setCenter(selectItem.coordinate);
    this.addMarker(selectItem.coordinate);

    this.setState({ value: selectItem.address, selectItem });
  };

  handleClear = () => {
    if (this.marker) {
      this.marker.hide();
      //清除上一次点击添加的标记
      this.marker.off('mouseenter');
      this.marker.off('mouseleave');
      // this.marker.removeTo(this.map);
    }

    if (this.infoWindow) {
      this.infoWindow.hide();
    }

    this.setState({
      selectItem: {},
      searchRes: [],
      value: ''
    });
  };

  handleLocate = () => {
    const { onChange } = this.props;
    const { selectItem } = this.state;
    if (_.isEmpty(selectItem)) {
      return;
    }
    if (_.isFunction(onChange)) {
      onChange(selectItem.address);
    }
  };

  render() {
    const { searchRes = [], selectItem = {} } = this.state;

    return (
      <div className={styles.ylMap}>
        <div id="mapContainer" className={styles.mapContainer}></div>
        <div className={styles.searchWrapper}>
          <AutoComplete
            className={styles.poiSearch}
            value={this.state.value}
            placeholder="请输入关键字"
            onSearch={this.handleSearch}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
            dataSource={searchRes.map((item) => (
              <Option
                key={item.id}
                value={item.id}
                className={styles.addressOption}>
                <div className={styles.addressOptionContent}>
                  <div className={styles.poiName}>
                    <MapIcon />
                    {item.name}
                  </div>
                  <div className={styles.poiAddress}>{item.address}</div>
                </div>
              </Option>
            ))}>
            <Input
              allowClear
              className={styles.searchInputWrapper}
              suffix={
                <Button
                  className="search-btn"
                  style={{ marginRight: -12, marginLeft: 5 }}
                  icon="search"
                  type="primary">
                  搜 索
                </Button>
              }
            />
          </AutoComplete>

          <div style={{ position: 'absolute', top: '-10000px' }}>
            <div className={styles.publicSentiment} id="public-sentiment">
              <div
                className={styles.publicSentimentName}
                hidden={!selectItem.name}>
                {selectItem.name}
              </div>
              <div className={styles.publicSentimentAddress}>
                {selectItem.address}
              </div>
            </div>
          </div>

          <div
            className={styles.deleteWrapper}
            onClick={this.handleClear}
            hidden={_.isEmpty(selectItem)}>
            <DeleteSvg />
          </div>
          <div
            className={styles.successWrapper}
            onClick={this.handleLocate}
            hidden={_.isEmpty(selectItem)}>
            <SuccessSvg />
          </div>
        </div>
      </div>
    );
  }
}

export default YLMap;
