import React, { Component } from 'react';
import { Row, Col, Button, Slider } from 'antd';
import styles from './downloadMedia.less';
import VolumeIcon from './VolumeIcon';
import { HHMMSS } from '@/utils';
import MediaDownload from '@/assets/img/MediaDownload.png';

export default class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      audioPercent: 0.0,
      isPlaying: false,
      url: '',
      currentTime: '00:00'
    };
    this.audio = React.createRef();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.url !== state.url) {
      state.url = props.url;
      state.audioPercent = 0.0;
      state.isPlaying = false;
      state.seekTime = 0;
      return state;
    } else {
      return null;
    }
  }

  componentDidMount() {
    const audio = this.audio;
    const ref = this;
    audio.current.ontimeupdate = function () {
      let { current } = audio;
      if (!current) {
        current = {};
      }
      const { duration = 0 } = current;
      if (duration > 0) {
        const percent = audio.current.currentTime / audio.current.duration;
        ref.setState({
          audioPercent: percent
        });

        //ref.playerState.seekTime = audio.current.currentTime;
      }
    };

    audio.current.onended = () => {
      ref.setState({
        isPlaying: false,
        seekTime: 0
      });
    };

    audio.current.addEventListener('loadedmetadata', function () {
      //console.log("Playing " + audio.src + ", for: " + audio.duration + "seconds.");
      ref.setState({
        duration: audio && audio.current && audio.current.duration
      });
    });
  }

  componentWillUnmount() {
    // audio.current.addEventListener('loadedmetadata', function() {
    //   //console.log("Playing " + audio.src + ", for: " + audio.duration + "seconds.");
    //   ref.setState({
    //     duration: audio.current.duration
    //   })
    // });
  }

  playerState = {
    seekTime: 0
  };

  loaderMetadataHandler() {
    const audio = this.audio;
    this.setState({
      duration: (audio && audio.current && audio.current.duration) || 0
    });
  }

  seek(seekTime) {
    const audio = this.audio.current;
    if (!audio) {
      return;
    }
    this.setState({
      isPlaying: true
    });
    audio.currentTime = seekTime / 1000.0;
    audio.play();
  }

  stop() {
    const audio = this.audio.current;
    if (!audio) {
      return;
    }
    this.setState({
      isPlaying: false
    });
    audio.stop();
  }

  render() {
    const { url, seekTime, seekHandler, downloadUrl } = this.props;
    console.log('url: ', url);
    const { audioPercent, isPlaying, duration } = this.state;
    const audio = this.audio.current;
    let timeString;
    if (this.state.duration !== undefined) {
      const leftTime = Math.max(
        this.state.duration - this.audio.current.currentTime,
        0
      );
      timeString = HHMMSS(leftTime);
    } else {
      timeString = '00:00';
    }

    let barWidth, timeShow, volShow;
    if (this.props.type === 'big') {
      barWidth = 16;
      timeShow = false;
      volShow = true;
    } else if (this.props.type === 'mid') {
      barWidth = 20;
      timeShow = true;
      volShow = false;
    } else if (this.props.type === 'small') {
      barWidth = 24;
      timeShow = false;
      volShow = false;
    }

    return (
      <Row className={styles.player}>
        <audio ref={this.audio} src={url}>
          浏览器不支持
        </audio>

        <Col span={barWidth}>
          <Row>
            <Col span={24} className={styles.playerContainer}>
              <div className={styles.playerButton}>
                <Button
                  disabled={url === undefined}
                  type="primary"
                  shape="circle"
                  icon={isPlaying ? 'pause' : 'caret-right'}
                  onClick={() => {
                    if (this.audio.current === undefined) {
                      return;
                    }
                    if (!isPlaying) {
                      this.audio.current.play();
                      this.setState({
                        isPlaying: true
                      });
                    } else {
                      this.audio.current.pause();
                      this.setState({
                        isPlaying: false
                      });
                    }
                  }}
                />
              </div>
              <div className={styles.slider}>
                <span className={styles.timePassed}>
                  {isNaN(Number(audioPercent * duration))
                    ? '00:00'
                    : Number(audioPercent * duration).toFixed(2)}
                </span>
                <span className={styles.timeAll}>
                  {isNaN(duration) ? '00:00' : Number(duration).toFixed(2)}
                </span>
                <Slider
                  style={{ width: '100%' }}
                  min={0}
                  max={1}
                  step={0.01}
                  defaultValue={audioPercent}
                  value={audioPercent}
                  tipFormatter={(value) => {
                    if (audio === null) {
                      return value;
                    }
                    const time = audio.duration * value;
                    if (isNaN(time)) {
                      return '00:00';
                    }
                    const text = HHMMSS(time);
                    return text;
                  }}
                  onChange={(value) => {
                    if (audio === null) {
                      return;
                    }
                    const time = audio.duration * value;
                    this.setState({
                      audioPercent: value
                    });
                    audio.currentTime = time;
                    seekHandler && seekHandler(time);
                  }}
                />
              </div>
              <img
                className={styles.downloadIcon}
                src={MediaDownload}
                alt=""
                onClick={(e) => window.open(downloadUrl)}
              />
            </Col>
          </Row>
        </Col>
        {timeShow && (
          <Col span={4} style={{ whiteSpace: 'nowrap' }}>
            {timeString}
          </Col>
        )}

        {volShow && (
          <Col span={8}>
            <Col span={3}>
              {/*<Button type="default" shape="circle" icon="sound" />*/}

              <VolumeIcon className={styles.icon} />
            </Col>
            <Col span={21}>
              <Slider
                min={0}
                max={1}
                step={0.01}
                defaultValue={0.8}
                tipFormatter={(value) => `${Math.floor(value * 100)}%`}
                onChange={(value) => {
                  if (audio === undefined) {
                    return;
                  }

                  audio.volume = value;
                }}
              />
            </Col>
          </Col>
        )}
      </Row>
    );
  }
}
