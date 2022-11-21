/* eslint-disable */
const OSS = require('ali-oss');
const { Command } = require('commander');
const program = new Command();
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const DelHelper = require('./del');
const AddHelper = require('./add');
const buildPath = path.resolve(__dirname, '../build');

program.version('0.0.1');
program
  .option('-b, --bucket <bucket>', 'oss仓库名称', 'decorationhome')
  .option('-p, --project <project>', '项目名称')
  .option('--env <env>', '发布环境');

program.parse(process.argv);

const options = program.opts();
console.log('options', options);

if (!options.project) {
  console.log('请输入项目名称');
  return;
}

if (!options.env) {
  console.log('请输入构建环境');
  return;
}

const getSTS = async () => {
  let res = await axios.get(
    'https://mcm.bthome.com/api/aliOss/getOssTempAccount.do'
  );

  if (res?.data?.code == 0 && res?.data?.data?.accessKeyId) {
    let obj = {
      accessKeyId: res.data.data.accessKeyId,
      accessKeySecret: res.data.data.accessKeySecret,
      securityToken: res.data.data.securityToken
    };
    return obj;
  }

  return null;
};

async function start() {
  let xres = await getSTS();
  if (!xres) {
    throw new Error('获取临时认证失败, 请手动上传文件');
  }

  let params = {
    accessKeyId: xres.accessKeyId,
    accessKeySecret: xres.accessKeySecret,
    stsToken: xres.securityToken,
    // region表示您申请OSS服务所在的地域，例如oss-cn-hangzhou。
    region: 'oss-cn-hangzhou',
    bucket: options.bucket
  };

  const client = new OSS(params);
  // const client = new OSS({
  //   region: "oss-cn-hangzhou",
  //   accessKeyId: "LTAINgsUXKmmdR16",
  //   accessKeySecret: "i0xfoPASCa0k0WvGPHLPUQwPF4GutO",
  //   bucket: options.bucket,
  // });

  let delObj = new DelHelper(client, options);
  let addObj = new AddHelper(client, options);

  // 删除历史记录
  delObj.removeDir(`${options.env}/web/${options.project}/`, () => {
    addObj.uploadDir(buildPath);
  });
}

start();
