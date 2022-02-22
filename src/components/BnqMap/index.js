import React, { Component } from 'react';
import { AutoComplete } from 'antd';
import styles from './index.less';

function G(id) {
  return document.getElementById(id);
}
class BnqMap extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.map = new window.BMapGL.Map(this.rootRef);
    this.map.centerAndZoom('上海市', 12); // 初始化地图,设置中心点坐标和地图级别
    this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放

    var cityControl = new window.BMapGL.CityListControl({
      // 控件的停靠位置（可选，默认左上角）
      anchor: window.BMAP_ANCHOR_TOP_LEFT,
      // 控件基于停靠位置的偏移量（可选）
      offset: new window.BMapGL.Size(10, 5)
    });
    // 将控件添加到地图上
    this.map.addControl(cityControl);

    // 添加搜索
    var ac = new window.BMapGL.Autocomplete({
      input: 'suggestId',
      location: this.map
    }); //建立一个自动完成的对象

    ac.addEventListener('onhighlight', function (e) {
      //鼠标放在下拉列表上的事件
      var str = '';
      var _value = e.fromitem.value;
      var value = '';
      if (e.fromitem.index > -1) {
        value =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
      }
      str =
        'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value;

      value = '';
      if (e.toitem.index > -1) {
        _value = e.toitem.value;
        value =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
      }
      str +=
        '<br />ToItem<br />index = ' +
        e.toitem.index +
        '<br />value = ' +
        value;
      G('searchResultPanel').innerHTML = str;
    });

    var myValue;
    ac.addEventListener('onconfirm', function (e) {
      //鼠标点击下拉列表后的事件
      var _value = e.item.value;
      myValue =
        _value.province +
        _value.city +
        _value.district +
        _value.street +
        _value.business;
      G('searchResultPanel').innerHTML =
        'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue;

      setPlace();
    });

    function setPlace() {
      this.map.clearOverlays(); //清除地图上所有覆盖物
      function myFun() {
        var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
        this.map.centerAndZoom(pp, 18);
        this.map.addOverlay(new window.BMapGL.Marker(pp)); //添加标注
      }
      var local = new window.BMapGL.LocalSearch(this.map, {
        //智能搜索
        onSearchComplete: myFun
      });
      local.search(myValue);
    }

    // 添加点击事件
    this.map.addEventListener('click', function (evt) {
      console.log('click', evt);
    });
  }

  componentWillUnmount() {
    this.map.removeEventListener('click');
  }

  handleZoom = (evt, x) => {
    console.log(evt.nativeEvent.wheelDelta);

    if (evt.nativeEvent.wheelDelta > 0) {
      this.map.zoomIn();
    } else {
      this.map.zoomOut();
    }
  };

  handleSearch = (evt) => {
    console.log(evt);
  };
  render() {
    return (
      <div className={styles.bnqMap}>
        <div>
          {/* <AutoComplete id="suggestId" /> */}
          <div id="r-result">
            请输入:
            <input
              type="text"
              id="suggestId"
              size="20"
              style={{ width: 150 }}
            />
          </div>
          <div
            id="searchResultPanel"
            style={{
              border: '1px solid #C0C0C0',
              width: 150,
              display: 'none'
            }}></div>
        </div>
        <div className="map-container" ref={(x) => (this.rootRef = x)} />
      </div>
    );
  }
}

export default BnqMap;
