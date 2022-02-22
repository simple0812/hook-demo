import React, { useState, useEffect, useCallback } from 'react';

export default ({ fetchData, initialValues = {} } = {}) => {
  const [total, setTotal] = useState(0);
  const [pageConditions, setPageConditions] = useState({
    currentPage: 1,
    pageSize: 10
  });

  const [searchConditions, setSearchConditions] = useState(initialValues);

  useEffect(() => {
    const getList = async () => {
      const { currentPage, pageSize } = pageConditions || {};
      if (!fetchData) {
        return;
      }
      const res = await fetchData({
        pageNum: currentPage,
        pageSize,
        ...searchConditions
      });

      if (res?.code === 0) {
        setTotal(res?.data?.total);
        return res;
      }
    };
    getList();
  }, [pageConditions, searchConditions]); // eslint-disable-line

  const handleSearch = (params) => {
    setPageConditions({
      currentPage: 1,
      pageSize: 10
    });
    setSearchConditions(params);
  };

  const handlePageChange = (params) => {
    setPageConditions({
      currentPage: params.current,
      pageSize: params.pageSize
    });
  };

  return {
    total,
    pageConditions,
    searchConditions,
    setTotal,
    setPageConditions,
    setSearchConditions,
    handleSearch,
    handlePageChange
  };
};
