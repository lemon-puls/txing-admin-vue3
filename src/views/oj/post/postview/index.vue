<template>
  <div id="viewPostView">
    <div id="postContentId">
      <div id="postBasicInfoId">
        <h1>{{ postInfo?.title }}</h1>
        <div
            style="
            display: flex;
            align-items: center;
            color: #7d7979;
            margin-top: 30px;
            margin-bottom: 40px;
          "
        >
          <a-space :size="'small'">
            <img
                :src="postInfo.user.userAvatar"
                style="
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    margin-right: 10px;
                  "
            />
            <span>{{ postInfo.user.userName }}</span>
            <span>{{ postInfo.createTime }}</span>
          </a-space>
        </div>
      </div>
      <MdViewer id="mdViewer" :value="postInfo.content || ''"/>
    </div>
  </div>
</template>

<script setup>
import MdViewer from "@/components/md/MdViewer.vue";
import {
  IconHeartFill,
  IconStarFill,
  IconHeart,
  IconStar,
  IconMessage,
  IconThumbUp,
  IconThumbUpFill,
} from "@arco-design/web-vue/es/icon";
import {
  defineProps,
  onBeforeMount,
  onMounted,
  reactive,
  ref,
  withDefaults,
} from "vue";
import message from "@arco-design/web-vue/es/message";
import {getPostVo} from "@/api/oj/post.js";
import _ from "lodash";
import {useRoute} from "vue-router";

const route = useRoute();

// onMounted(async () => {
//   await loadPostInfo();
// });

let postInfo = ref ({
  id: 0,
  title: "",
  content: "",
  thumbNum: 0,
  favourNum: 0,
  userId: "",
  createTime: "",
  updateTime: "",
  tagList: null,
  user: {
    id: 0,
    userName: "",
    userAvatar: "",
    userProfile: null,
    userRole: "",
    createTime: "",
    school: "",
    profession: "",
    workExperience: null,
    questionCount: 0,
    acceptedRate: 0,
    submitCount: 0,
    acceptedCount: 0,
    personSign: "",
  },
  commentNum: 0,
  coverImg: "",
  hasThumb: false,
  hasFavour: false,
});

// const props = withDefaults(defineProps(), {
//   id: () => "",
// });
const postId = route.query.postId;
// 加载文章详情
const loadPostInfo = async () => {
  getPostVo(postId).then(res => {
    if (res.code == 200) {
      postInfo.value = res.data;
    } else {
      message.error("加载文章数据失败:" + res.message);
    }
  })
};

/**
 * 评论
 */
// interface
// commentEntity
// {
//   id: number;
//   userName: string;
//   userAvatar: string;
//   content: string;
//   favourNum: number;
//   createTime: string;
//   isFavour: boolean;
// }

let commentData = ref ([]);
// 发表评论
// 采用列表展示评论
const searchCommentParams = ref ({
  filter: [
    {
      fieldName: "postId",
      queryType: "eq",
      value: postInfo.value?.id + "",
    },
  ],
  page: {
    current: 1,
    pageSize: 20,
  },
});
const loadCommentData = async (current) => {
  const postId = postInfo.value?.id;
  const res = await PostCommentControllerService.listUsingPost({
    ...searchCommentParams.value,
    filter: [
      {
        fieldName: "postId",
        queryType: "eq",
        value: postInfo.value?.id?.toString(),
      },
    ],
    page: {
      current: current,
      pageSize: 20,
    },
  });
  if (res.code == 0) {
    return res;
  } else {
    message.error("评论数据加载失败！");
    return null;
  }
};
const current = ref(0);
const pageCount = ref(-1);
const bottom = ref(0);

const fetchData = async () => {
  if (
      (pageCount.value === -1 || current.value < pageCount.value) &&
      bottom.value === 0
  ) {
    current.value++;
    const res = await loadCommentData(current.value);
    if (res == null) {
      return;
    }
    if (res.data.total === 0) {
      bottom.value = 2;
      return;
    }
    // 剔除可能的重复评论
    let targetData;
    if (commentData.value.length !== 0) {
      targetData = res.data.list.filter(
          (item) =>
              item.createTime <=
              commentData.value[commentData.value.length - 1].createTime
      );
    } else {
      targetData = res.data.list;
    }
    commentData.value = commentData.value.concat(targetData);
    pageCount.value = res.data.pageCount;
    if (pageCount.value === current.value) {
      bottom.value = 1;
    }
  } else {
    bottom.value = 1;
  }
};
const throttle = _.throttle(fetchData, 3000); //引入lodash功能

// 滚动检测
// 评论弹出框
const visible = ref(false);
const position = ref("right");

const scrollArea = ref < HTMLElement | null > (null);

const findParentElement = (element, parentSelector) => {
      let parent = element.parentElement;
      while (parent !== null) {
        if (parent.matches(parentSelector)) {
          return parent;
        }
        parent = parent.parentElement;
      }
      return null; // 如果没有找到匹配的父元素则返回 null
    }
;
let targetElement;
const handleClick = async () => {
  visible.value = true;
  await throttle();
  targetElement = document.querySelector(".arco-drawer-body")
  as
  HTMLElement;
  // if (scrollArea.value) {
  // scrollArea.value.addEventListener("scroll", handleScroll);
  // window.addEventListener("scroll", handleScroll);
  // const target = findParentElement(scrollArea.value, "#desiredParentId");
  targetElement?.addEventListener("scroll", scrollThrottle);
  // }
};
const handleCancel = () => {
  targetElement.removeEventListener("scroll", handleScroll);
  visible.value = false;
};

const handleScroll = () => {
  if (bottom.value !== 0) {
    return;
  }

  const {scrollTop, scrollHeight, clientHeight} = targetElement;
  // 判断是否滑到了底部
  if (scrollTop + clientHeight + 1 >= scrollHeight) {
    // 触底，调用加载数据的方法
    throttle();
  }
  // const windowHeight = window.innerHeight;
  // const scrollTop =
  //   document.documentElement.scrollTop || document.body.scrollTop;
  // const scrollHeight =
  //   document.documentElement.scrollHeight || document.body.scrollHeight;
  // if (scrollTop + windowHeight + 1 >= scrollHeight) {
  //   console.log("加载数据啦");
  //   console.log(
  //     "windowHeight, scrollTop, scrollHeight",
  //     windowHeight,
  //     scrollTop,
  //     scrollHeight,
  //     scrollTop + windowHeight + 1 >= scrollHeight
  //   );
  //   throttle();
  // }
};
const scrollThrottle = _.throttle(handleScroll, 1000); //引入lodash功能

const commentText = ref ("");
const publishComment = async () => {
  if (commentText.value === "") {
    message.info("请输入评论内容");
    return;
  }
  const res = await PostCommentControllerService.saveUsingPost({
    content: commentText.value,
    postId: postInfo.value?.id,
  });
  if (res.code == 0) {
    message.info("评论发表成功");
    commentText.value = "";
    // loadCommentData();
    // 添加到数组头
    commentData.value.unshift(res.data);
    postInfo.value.commentNum++;
    // 如果原本没有评论数据 此时发表第一条评论 需要改变 bottom，以免显示 空状态
    if (commentData.value.length === 1) {
      bottom.value = 1;
    }
  } else {
    message.error(res.msg);
  }
};

// 点击收藏
const clickFavour = async () => {
  if (postInfo.value?.id) {
    const res = await PostFavourControllerService.doPostFavourUsingPost({
      postId: postInfo.value.id,
    });
    if (res.code !== 0) {
      message.error(res.msg);
      return;
    }
    postInfo.value.hasFavour = !postInfo.value.hasFavour;
    if (postInfo.value.hasFavour === true) {
      postInfo.value.favourNum++;
      message.success("收藏成功");
    } else {
      postInfo.value.favourNum--;
      message.success("已取消收藏");
    }
  } else {
    message.error("无法获取到当前题目信息 请刷新重试！");
    return;
  }
};
// 点赞
const clickThumb = async () => {
  if (postInfo.value?.id) {
    const res = await PostThumbControllerService.doThumbUsingPost({
      postId: postInfo.value.id,
    });
    if (res.code !== 0) {
      message.error(res.msg);
      return;
    }
    postInfo.value.hasThumb = !postInfo.value.hasThumb;
    if (postInfo.value.hasThumb === true) {
      postInfo.value.thumbNum++;
      message.success("收藏成功");
    } else {
      postInfo.value.thumbNum--;
      message.success("已取消收藏");
    }
  } else {
    message.error("无法获取到当前题目信息 请刷新重试！");
    return;
  }
};

// 文章评论点赞
const onLikeChange = async (index) => {
  const res = await PostCommentControllerService.thumbQuestionCommentUsingGet(
      commentData.value[index].id,
      props.id
  );
  if (res.code != 0) {
    message.error(res.msg);
    return;
  }
  commentData.value[index].isFavour = !commentData.value[index].isFavour;
  if (commentData.value[index].isFavour) {
    commentData.value[index].favourNum = commentData.value[index].favourNum + 1;
  } else {
    commentData.value[index].favourNum = commentData.value[index].favourNum - 1;
  }
};

loadPostInfo()
</script>

<style>
#viewPostView {
  max-width: 1280px;
  width: 70vw;
  margin: 0 auto;
  background: rgba(255, 255, 255, 1);
  /*padding-right: 10px;*/
  /*padding-left: 10px;*/
  padding: 20px 20px;
  flex: 1;
}

#postContentId {
  width: 80% !important;
  margin: 0 8% 0 12%;
}

#leftBar {
  width: 50px;
  height: 200px;
  position: fixed;
  /*left: 100;*/
  margin-left: 1%;
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0);
  color: #185eff;
}

#viewPostView .arco-badge-number {
  background-color: rgba(0, 0, 0, 0);
  color: #007bff;
  border: 0;
  box-shadow: 0 0 0 0px;
}

#commentDrawerId .arco-list-wrapper {
  width: 100%;
}
</style>
