/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 *
 * Version: 5.8.2 (2021-06-23)
 */
/* eslint-disable */
(function () {
  var global = window.tinymce.util.Tools.resolve('tinymce.PluginManager');

  var setContent = function (editor, html) {
    editor.focus();
    editor.undoManager.transact(function () {
      editor.setContent(html);
    });
    editor.selection.setCursorLocation();
    editor.nodeChanged();
  };
  var getContent = function (editor) {
    return editor.getContent({ source_view: true });
  };
  var open = function (editor) {
    let txt = getContent(editor);

    //清除所有html空格
    txt = txt.replace(/&nbsp;/gi, '');

    //清除所有空行（摘录网上，实测可用）
    var arrPattern = [
      '<p(>|\\s+[^>]*>)(&nbsp|&nbsp;|\\s|　|<br\\s*(/)?>)*</p(>|\\s+[^>]*>)',
      '(<br\\s*(/)?>((\\s|&nbsp;|&nbsp|　)*)){2,}',
      '(<p(>|\\s+[^>]*>))((&nbsp|&nbsp;|\\s)*<br\\s*(/)?>)*((.|\n|\r)*?</p(>|\\s+[^>]*>))'
    ];
    var arrReplace = ['', '<br />$3', '$1$6'];
    for (var i = 0; i < arrPattern.length; i++) {
      var arrRegExp = new RegExp(arrPattern[i], 'img');
      txt = txt.replace(arrRegExp, arrReplace[i]);
    }

    //清除所有非空格的空白字符，空格字符去除可能导致元素属性出错
    txt = txt.replace(/[\f\n\r\t\v]/gi, '');

    //清除所有span
    txt = txt.replace(/<(\/span|span).*?>/gi, '');

    //清除所有空的section
    txt = txt.replace(/<section[^>]*>\s*<\/section>/gi, '');

    //清除超链接，将网址分离在后
    txt = txt.replace(
      /<a.*?href\s*=\s*[\"|\'](.*?)[\"|\'].*?>(.*?)<\/a>/gi,
      '$2'
    );
    // txt = txt.replace(
    //   /<a.*?href\s*=\s*[\"|\'](.*?)[\"|\'].*?>(.*?)<\/a>/gi,
    //   '$2[网址：$1]'
    // );
    //实际运行中发现有些错误的a链接可能根本没有href，所以需要再次清理
    txt = txt.replace(/<(\/a|a).*?>/gi, '');

    //清除所有class，为防止有些class不加引号，因此强制规定只清除元素内的class，这种写法最笨和直观，聪明的看下一个
    txt = txt.replace(
      /<([a-zA-Z1-6]+)(.*?)\s*class\s*=\s*[\"|\']?.*?[\"|\']\s*([^>]*?)>/gi,
      '<$1 $2 $3>'
    );

    //清除所有style属性
    //直接量语法：
    txt = txt.replace(/style\s*?=\s*?([\'\"])[\s\S]*?\1/gi, '');
    //RegExp对象语法，可用于自定义变量，比如出了style以外的class，lang等等
    var v = 'style';
    txt = txt.replace(
      new RegExp(v + '\\s*?=\\s*?([\'"])[\\s\\S]*?\\1', 'ig'),
      ''
    );

    //清除所有元素属性，超链接和img地址可能被清除
    // txt = txt.replace(/<([a-zA-Z1-6]+)(\s*[^>]*)?>/ig, "<$1>");

    //给每段加上样式
    txt = txt.replace(/<p.*?>/gi, '<p style="text-indent:2em;">');

    //去除除img标签外其它标签
    // txt = txt.replace(/<(?!img).*?>/g, "");

    //去除strong标签
    txt = txt.replace(/<strong[^>]*>/g, '');
    txt = txt.replace(/<\/strong[^>]*>/g, '');

    //使用p替换img外所有标签，则为：
    txt = txt.replace(/<\/[^>]*?>/g, '</p>'); // 替换 </h1>等
    txt = txt.replace(
      /<(?!img|p|\/)[^>]*?[^/]>/g,
      '<p style="text-indent:2em;">'
    );

    setContent(editor, txt);
  };

  var register = function (editor) {
    editor.addCommand('mceArticleEditor', function () {
      open(editor);
    });
  };

  var register$1 = function (editor) {
    editor.ui.registry.addButton('article', {
      // icon: 'sourcecode',
      tooltip: '一键排版',
      text: '一键排版',
      onAction: function () {
        return open(editor);
      }
    });
    editor.ui.registry.addMenuItem('article', {
      // icon: 'sourcecode',
      text: '一键排版',

      onAction: function () {
        return open(editor);
      }
    });
  };

  function Plugin() {
    global.add('article', function (editor) {
      register(editor);
      register$1(editor);
      return {};
    });
  }

  Plugin();
})();
