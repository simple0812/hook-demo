import { useEffect } from 'react';
import mobxInjectStore from '@/utils/mobxInjectStore';
import { toJS } from 'mobx';
import Test from '@/utils/test';

function Foo(props) {
  let a = Test.getInstance().bar;
  console.log('aaaa', props, toJS(props.globalStore.globalLoading));

  useEffect(() => {
    props.globalStore.$getDataList();
  }, []);
  return (
    <div>
      <div>Foo{process.env.REACT_APP_ZX}</div>
      <div onClick={props.globalStore.toggle}>{props.globalStore.locale}</div>
      <div>{props.globalStore.double}</div>
      <div>
        <div onClick={props.globalStore.$getDataList}>====================</div>
        {toJS(props.globalStore.$dataList)?.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </div>
  );
}

export default mobxInjectStore('globalStore')(Foo);
