import _ from 'lodash';

export function findFromTreeBy(tree, fn) {
  if (_.isEmpty(tree)) {
    return null;
  }

  // 默认返回第一个元素
  if (!_.isFunction(fn)) {
    fn = () => true;
  }

  let target = null;

  for (let i = 0; i < tree.length; i++) {
    const each = tree[i];
    if (fn(each)) {
      target = each;
      break;
    }

    if (each.children) {
      target = findFromTreeBy(each.children, fn);
      if (target) {
        break;
      }
    }
  }

  return target;
}

export function findLeafsOfTree(tree, leafs, isLeaf) {
  //默认判断是否含有子节点
  if (!_.isFunction(isLeaf)) {
    isLeaf = function (each) {
      return _.isEmpty(each.children);
    };
  }

  leafs = leafs || [];
  if (_.isEmpty(tree)) {
    return leafs;
  }

  for (let i = 0; i < tree.length; i++) {
    const each = tree[i];

    if (isLeaf(each)) {
      leafs.push(each);
    } else {
      findLeafsOfTree(each.children, leafs, isLeaf);
    }
  }

  return leafs;
}

export function findByIdFromTree(tree, id) {
  if (_.isEmpty(tree)) {
    return null;
  }

  let target = null;

  for (let i = 0; i < tree.length; i++) {
    const each = tree[i];
    if (each.id === id) {
      target = each;
      break;
    }

    if (each.children) {
      target = findByIdFromTree(each.children, id);
      if (target) {
        break;
      }
    }
  }

  return target;
}

export function filterHTMLTag(msg) {
  if (!msg) {
    return msg;
  }
  msg = msg.replace(/<\/?[^>]*>/g, ''); //去除HTML Tag
  msg = msg.replace(/[|]*\n/, ''); //去除行尾空格
  msg = msg.replace(/&npsp;/gi, ''); //去掉npsp
  return msg;
}
export default {
  filterHTMLTag,
  findByIdFromTree,
  findFromTreeBy,
  findLeafsOfTree
};
