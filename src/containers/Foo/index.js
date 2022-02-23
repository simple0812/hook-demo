import { useEffect } from 'react';
import mobxInjectStore from '@/utils/mobxInjectStore';
import { toJS } from 'mobx';
import Test from '@/utils/test';

function Foo(props) {
  let a = Test.getInstance().bar;

  useEffect(() => {
    props.xxx.$getDataList();
  }, []);
  return (
    <div>
      <div>Foo{process.env.REACT_APP_ZX}</div>
      <div onClick={props.xxx.toggle}>{props.xxx.locale}</div>
      <div>{props.xxx.double}</div>
      <div>
        <div onClick={props.xxx.$getDataList}>====================</div>
        {toJS(props.xxx.$dataList)?.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </div>
  );
}

export default mobxInjectStore(({ globalStore }) => ({ xxx: globalStore }))(
  Foo
);
