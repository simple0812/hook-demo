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
    this.map = new window.BMapGL.Map(this.mapRef);
    var geolocation = new window.BMapGL.Geolocation();
    let _this = this;
    _this.map.centerAndZoom('上海市', 12);
    geolocation.getCurrentPosition(function (r) {
      if (this.getStatus() == window.BMAP_STATUS_SUCCESS) {
        _this.map.centerAndZoom(r.point, 12);
      }
    });

    this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放

    this.map.on('click', (e) => {
      let point = new window.BMapGL.Point(e.latlng.lng, e.latlng.lat);
      this.addMarker(point);

      var gc = new window.BMapGL.Geocoder();

      gc.getLocation(point, (rs) => {
        console.log('rs', rs);
        this.setState({
          value: rs.address,
          selectItem: {
            name: rs.address,
            address: rs.address,
            coordinate: e.point
          }
        });
      });
    });
  }

  @debounce(500)
  handleSearch = (keyword) => {
    if (keyword) {
      this.mapSearchByKeyWord(keyword);
    } else {
      this.setState({ searchRes: [] });
    }
  };

  mapSearchByKeyWord = (keyword) => {
    if (!this.localSearch) {
      this.localSearch = new window.BMapGL.LocalSearch(this.map, {
        renderOptions: { map: this.map },
        onSearchComplete: () => {
          var res = this.localSearch.getResults();
          if (!res || _.isEmpty(res._pois)) {
            return;
          }

          console.log(res._pois);
          let pois = res._pois.map((item) => {
            item.name = item.title;
            item.id = item.name + '_' + item.point.lat + '_' + item.point.lng;
            item.coordinate = item.point;
            return item;
          });

          this.setState({
            searchRes: pois
          });
        }
      });
    }

    this.localSearch.search(keyword);
  };

  handleChange = (value) => {
    this.setState({ value });
  };

  addMarker = (coordinate) => {
    if (this.marker) {
      //清除上一次点击添加的标记
      this.map.removeOverlay(this.marker);
    }
    this.marker = new window.BMapGL.Marker(coordinate, {
      //添加标记
      // offset: [-10, -28],
      enableDragging: false
    });

    this.map.addOverlay(this.marker);
  };

  handleSelect = (value) => {
    const { searchRes = [] } = this.state;

    const selectItem = searchRes.find((item) => item.id === value);
    this.map.setCenter(selectItem.coordinate);
    this.addMarker(selectItem.coordinate);

    this.setState({
      value: selectItem.province + selectItem.city + selectItem.address,
      selectItem
    });
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
      onChange(selectItem.address, selectItem);
    }
  };

  render() {
    const { searchRes = [], selectItem = {} } = this.state;

    return (
      <div className={styles.ylMap}>
        <div
          id="mapContainer"
          ref={(x) => (this.mapRef = x)}
          className={styles.mapContainer}></div>
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
