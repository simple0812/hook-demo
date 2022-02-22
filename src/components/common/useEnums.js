import React, { useState, useEffect } from 'react';

export default ({ fetchData } = {}) => {
  const [enums, setEnums] = useState(null);

  useEffect(() => {
    const getAllEnums = async () => {
      if (!fetchData) {
        return;
      }
      let localEnums = localStorage.getItem('enums');
      //console.log('localEnums', localEnums);
      if (localEnums) {
        localEnums = JSON.parse(localEnums);
        const cacheDate = localEnums?.time;
        const nowDate = new Date().getTime();
        //缓存时间小于1天
        if (cacheDate && nowDate - cacheDate < 24 * 60 * 60 * 1000) {
          setEnums(localEnums?.data);
          return;
        }
      }
      const res = await fetchData();
      if (res?.code === 0) {
        const { data } = res;
        let result = {};
        Object.keys(data).map((key) => {
          const item = data[key].map(({ code, name, ...children }) => {
            return {
              value: code,
              label: name,
              children
            };
          });
          result[key] = item;
          return result;
        });
        // console.log('result', result);
        setEnums(result);
        localStorage.setItem(
          'enums',
          JSON.stringify({
            time: new Date().getTime(),
            data: result
          })
        );
      }
    };
    getAllEnums();
  }, [fetchData]);

  return {
    enums
  };
};
