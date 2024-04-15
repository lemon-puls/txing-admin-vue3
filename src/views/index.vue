<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>Txing编程在线学习平台</h2>
        <p>
          本项目旨在为编程爱好者和开发者提供一个高效、便捷的在线学习平台，该平台是集在线做题、编程竞赛、即时通讯、文章创作、视频教程、技术论坛为一体的综合平台，一站式地满足用户的各种编程学习需求，而无需在多个平台间来回切换。
          <br/>用户可以在编程题目、技术文章、视频教程中快速提升编程能力，开拓专业视野和思维广度。同时可以通过在线竞赛等途径，让用户以激烈的竞争方式来切磋技术，从而带动用户提高能力的积极性；此外平台提供即时通讯、技术论坛等功能，可以让用户轻松建立技术社交网络和资源共享机制，促进技术交流，有利于编程领域的人才培养和行业发展。
        </p>
        <!--        <p>-->
        <!--          <b>当前版本:</b> <span>v{{ version }}</span>-->
        <!--        </p>-->
        <!--        <p>-->
        <!--          <el-tag type="danger">&yen;免费开源</el-tag>-->
        <!--        </p>-->
        <p>
          <el-button
              type="primary"
              icon="Cloudy"
              plain
              @click="goTarget('https://gitee.com/lemon_plus/txing_admin_vue3')"
          >访问码云
          </el-button
          >
          <el-button
              icon="HomeFilled"
              plain
              @click="goTarget('http://124.71.1.148/#/txing')"
          >访问客户端
          </el-button
          >
        </p>
      </el-col>

      <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <el-row>
          <el-col :span="12">
            <h2>技术选型</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <h4>后端技术</h4>
            <ul>
              <li>SpringBoot</li>
              <li>Spring Security</li>
              <li>JWT</li>
              <li>MyBatis</li>
              <li>Druid</li>
              <li>Fastjson</li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>前端技术</h4>
            <ul>
              <li>Vue</li>
              <li>Vuex</li>
              <li>Element-ui</li>
              <li>Axios</li>
              <li>Sass</li>
              <li>Quill</li>
              <li>...</li>
            </ul>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider/>
  </div>
</template>

<script setup name="Index">
const version = ref('3.8.7')

function goTarget(url) {
  window.open(url, '__blank')
}
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }

  //background-image: linear-gradient(to top, #accbee 0%, #e7f0fd 100%);
  //position: absolute;
  //top: 0;
  //bottom: 0;
  //left: 0;
  //right: 0;

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

