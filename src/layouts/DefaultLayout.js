import './index.less';

export default function (props) {
  return (
    <div className="layout-default">
      <div className="layout-default-side">侧边栏</div>
      <div className="layout-default-content">
        <div className="layout-default-head">顶部</div>
        <div className="layout-default-body">{props.children}</div>
      </div>
    </div>
  );
}
