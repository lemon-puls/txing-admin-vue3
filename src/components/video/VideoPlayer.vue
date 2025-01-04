<template>
  <div id="videoPlayerId">
    <video
        :id="tcPlayerId"
        ref="videoPlayer"
        preload="auto"
        playsinline
        :style="{ width: videoWidth, height: videoHeight }"
        webkit-playsinline
        x5-playsinline
    ></video>
  </div>
</template>

<script setup>
import TCPlayer from "tcplayer.js";
import {defineProps, onMounted, onBeforeUnmount, ref} from "vue";
import message from "@arco-design/web-vue/es/message";
import {getPlaySign} from "@/api/oj/course.js";

const videoWidth = "60vw";
const videoHeight = "34vw";
const videoPlayer = ref();

// 监听全屏状态变化
const handleFullScreenChange = () => {
  if (
      document.fullscreenElement
      // ||
      // document.webkitFullscreenElement ||
      // document.mozFullScreenElement ||
      // document.msFullscreenElement
  ) {
    // 进入全屏时，设置视频宽高为100%以占满整个屏幕
    // alert("exec 1");
    if (videoPlayer.value) {
      // alert("exec 100");
      videoPlayer.value.style.width = "100vw";
      videoPlayer.value.style.height = "100vh";
    }
  } else {
    // 退出全屏时，恢复原来的宽高设定
    if (videoPlayer.value) {
      // alert("exec 60");
      videoPlayer.value.style.width = videoWidth;
      videoPlayer.value.style.height = videoHeight;
    }
  }
};

onMounted(() => {
  document.addEventListener("fullscreenchange", handleFullScreenChange);
  // document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
  // document.addEventListener("mozfullscreenchange", handleFullScreenChange);
  // document.addEventListener("msfullscreenchange", handleFullScreenChange);
});

onBeforeUnmount(() => {
  document.removeEventListener("fullscreenchange", handleFullScreenChange);
  // document.removeEventListener(
  //   "webkitfullscreenchange",
  //   handleFullScreenChange
  // );
  // document.removeEventListener("mozfullscreenchange", handleFullScreenChange);
  // document.removeEventListener("msfullscreenchange", handleFullScreenChange);
});

const props = defineProps({
  fileId: {
    type: String,
    required: true,
  },
  tcPlayerId: {
    type: String,
    required: true,
  },
});
let player = null;
onMounted(async () => {
  getPlaySign(props.fileId).then(res => {
    if (res.code != 200) {
      message.error("获取签名失败：", res.msg);
      return;
    }
    const sign = res.data;
    // player-container-id 为播放器容器 ID，必须与 html 中一致
    player = TCPlayer(props.tcPlayerId, {
      // player-container-id 为播放器容器ID，必须与html中一致
      fileID: props.fileId, // 请传入需要播放的视频fileID 必须
      appID: import.meta.env.VITE_APP_VOD_APP_ID, // 请传入点播账号的子应用appID 必须
      psign: sign,
      autoplay: false, // 是否自动播放
      // 其他参数请在开发文档中查看
      licenseUrl: import.meta.env.VITE_APP_VOD_LICENSE_URL,
      bigPlayButton: false
    });
  })
});
</script>

<style lang="scss">
@import "tcplayer.js/dist/tcplayer.min.css";

#videoPlayerId {
  //限制右键弹框
  .tcp-right-click-popup-menu {
    z-index: -1 !important;
  }
}
</style>
