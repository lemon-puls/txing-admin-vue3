<template>
  <div id="mdEditorId">
    <Editor
        :value="value"
        :mode="mode"
        :locale="zhHans"
        :plugins="plugins"
        @change="handleChange"
        :uploadImages="uploadImage"
    />
  </div>
</template>

<script setup lang="ts">
import {Editor, Viewer} from "@bytemd/vue-next";
// import {FileControllerService} from "../../generated";
import message from "@arco-design/web-vue/es/message";
import {defineProps, withDefaults} from "vue";
import breaks from "@bytemd/plugin-breaks";
import frontmatter from "@bytemd/plugin-frontmatter";
import gemoji from "@bytemd/plugin-gemoji";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import highlightssr from "@bytemd/plugin-highlight-ssr";
import math from "@bytemd/plugin-math";
import mathssr from "@bytemd/plugin-math-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import mermaid from "@bytemd/plugin-mermaid";


// CSS
import "bytemd/dist/index.min.css";
import "highlight.js/styles/default.css";
import "katex/dist/katex.css";
import "juejin-markdown-themes/dist/juejin.min.css";
// 中文包
import zhHans from "bytemd/locales/zh_Hans.json";
import gfmLocale from "@bytemd/plugin-gfm/locales/zh_Hans.json";
import mathLocale from "@bytemd/plugin-math/locales/zh_Hans.json";
import mermaidLocale from "@bytemd/plugin-mermaid/locales/zh_Hans.json";

const plugins = [
  gfm({locale: gfmLocale}),
  highlight(),
  mediumZoom(),
  gemoji(),
  breaks(),
  frontmatter(),
  math({locale: mathLocale}),
  mediumZoom(),
  mermaid({locale: mermaidLocale}),
  // Add more plugins here
];

interface Props {
  value: string;
  handleChange: (v: string) => void;
  mode?: string;
  postId?: string;
  biz?: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  handleChange: (v: string) => {
    // console.log(v);
  },
  mode: () => "split",
  postId: () => "-1",
  biz: () => "common",
});
// 上传图片
const uploadImage = async (files) => {
  // let xhr = new XMLHttpRequest();
  const formData = new FormData();
  formData.append('file', files[0]); // 将文件添加到 FormData
  formData.append('postId', props.postId); // 将字符串值添加到 FormData
  formData.append("biz", props.biz);
  const res = await sendRequest('http://localhost:8121/api/file/upload/12423534672436234', formData);
  var data = JSON.parse(res as any);
  if (data.code !== 0) {
    message.error(data.msg);
    return [
      {
        title: files[0].name,
        url: "",
      },
    ];
  }
  message.success("上传成功");
  return [
    {
      // title: files.map((i: any) => i.name),
      title: files[0].name,
      url: data.data,
    },
  ];

  // xhr.open('POST', 'http://localhost:8121/api/file/upload/12423534672436234', false);
  // xhr.onreadystatechange = function () {
  //   if (xhr.readyState === XMLHttpRequest.DONE) {
  //     if (xhr.status === 200) {
  //       var data = JSON.parse(xhr.responseText);
  //       if (data.code !== 0) {
  //         message.error(data.msg);
  //         return [
  //           {
  //             title: files[0].name,
  //             url: "",
  //           },
  //         ];
  //       }
  //       message.success("上传成功");
  //       return [
  //         {
  //           // title: files.map((i: any) => i.name),
  //           title: files[0].name,
  //           url: data.data,
  //         },
  //       ];
  //
  //       // if (data.code != 0) {
  //       //   message.error(data.msg);
  //       //   return;
  //       // }
  //       // message.success("上传成功");
  //     } else {
  //       message.error("上传失败，请稍后重试！");
  //     }
  //   }
  // };
  // xhr.send(formData as any);

  // const res = await FileControllerService.uploadFileUsingPost(
  //     props.biz,
  //     props.postId,
  //     files[0]
  // );
  // if (res.code !== 0) {
  //   message.error(res.msg);
  //   return [
  //     {
  //       title: files[0].name,
  //       url: "",
  //     },
  //   ];
  // }
  // return [
  //   {
  //     // title: files.map((i: any) => i.name),
  //     title: files[0].name,
  //     url: res.data,
  //   },
  // ];
};

const sendRequest = (url: string, formData: any) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(xhr.responseText); // 请求成功，返回结果
        } else {
          reject(xhr.statusText); // 请求失败，返回错误信息
        }
      }
    };
    xhr.open('POST', url, false);
    xhr.send(formData); // 将 FormData 对象作为请求体发送
  });
}
</script>

<style lang="scss">
#mdEditorId {
  .bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:last-child {
    display: none !important;
  }

  .bytemd {
    height: 400px;
  }

  .bytemd-fullscreen {
    z-index: 20000 !important;
  }
}
.medium-zoom-overlay {
  opacity: 0.6 !important;
  background: black !important;
  z-index: 10000;
}

.medium-zoom-image {
  z-index: 10001;
}
</style>
