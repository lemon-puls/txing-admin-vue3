<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="关键词">
        <el-input
            v-model="keyWord"
            placeholder="请输入关键词查找"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户id" prop="userId">
        <a-select v-model="queryParams.userId" :style="{width:'220px'}" allow-clear allow-search
                  placeholder="指定用户查看...">
          <a-option v-for="user in userShows" :value="user.id"
                    :label="user.userName" :key="user.id" class="user-row">
            <div style="display: flex; align-items: center; column-gap: 10px">
              <img style="width: 20px; height: 20px; border-radius: 50%"
                   :src="user.userAvatar">
              {{ user.userName }}
            </div>

          </a-option>
          <template #label="{ data }">
            {{ data.label }}
          </template>
        </a-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            type="primary"-->
      <!--            plain-->
      <!--            icon="Plus"-->
      <!--            @click="handleAdd"-->
      <!--            v-hasPermi="['oj:course:add']"-->
      <!--        >新增-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            type="success"-->
      <!--            plain-->
      <!--            icon="Edit"-->
      <!--            :disabled="single"-->
      <!--            @click="handleUpdate"-->
      <!--            v-hasPermi="['oj:course:edit']"-->
      <!--        >修改-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            type="danger"-->
      <!--            plain-->
      <!--            icon="Delete"-->
      <!--            :disabled="multiple"-->
      <!--            @click="handleDelete"-->
      <!--            v-hasPermi="['oj:course:remove']"-->
      <!--        >删除-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="courseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="id" align="center" prop="id"/>-->
      <el-table-column label="名称" align="center" prop="name"/>
      <el-table-column label="封面" align="center" prop="coverUrl" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.coverUrl" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="时长" align="center" prop="times">
        <template #default="scope">
          <span>{{ formatSecondsToTime(scope.row.times) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="节数" align="center" prop="noduleCount"/>
      <el-table-column label="收藏数" align="center" prop="favourCount"/>
      <el-table-column label="作者" align="center" prop="user">
        <template #default="scope">
          <div style="display: flex; flex-direction: column; align-items: center">
            <img :src="scope.row.user.userAvatar" style="width: 25px; height: 25px; border-radius: 50%">
            <span>{{ scope.row.user.userName.slice(0, 5) }}<span
                v-if="scope.row.user.userName.length > 5">...</span></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="简介" align="center" prop="intro" width="200">
        <template #default="scope">
          <span v-if="scope.row.intro.length < 30">{{ scope.row.intro }}</span>
          <span v-else>{{ scope.row.intro.substr(0, 30) + " ..." }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="status">
        <template #default="scope">
          <el-tag type="primary" v-if="scope.row.status == 0">审核中</el-tag>
          <el-tag type="success" v-else-if="scope.row.status == 1">审核通过</el-tag>
          <el-tag type="danger" v-else>不通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <div class="row-ops" style="display: flex; justify-content: center; align-items: center">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">
              审批
            </el-button>
            <!--            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"-->
            <!--                       v-hasPermi="['oj:course:remove']">删除-->
            <!--            </el-button>-->
            <el-button link type="primary" icon="" @click="handlePlay(scope.row)">
              <el-icon class="el-icon--left">
                <SvgIcon icon-class="video"/>
              </el-icon>
              播放
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改课程对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="courseRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="审核状态" prop="status">
          <el-select
              v-model="form.status"
              placeholder="Select"
              size="large"
              style="width: 240px"
          >
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input maxlength="20" show-word-limit v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Course">
import {listCourse, getCourse, delCourse, addCourse, updateCourse} from "@/api/oj/course";
import {formatSecondsToTime} from "@/utils/computeTime.ts";
import SvgIcon from "@/components/SvgIcon/index.vue";
import router from "@/router/index.js";
import modal from "@/plugins/modal.js";
import {ref} from "vue";
import {getUserShowList} from "@/api/oj/user.js";

const {proxy} = getCurrentInstance();

const courseList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const keyWord = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    userId: null,
    intro: null,
    status: null,
  },
  rules: {
    name: [
      {required: true, message: "名称不能为空", trigger: "blur"}
    ],
    coverUrl: [
      {required: true, message: "封面不能为空", trigger: "blur"}
    ],
  }
});

const {queryParams, form, rules} = toRefs(data);

/** 查询课程列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (keyWord.value && keyWord.value != "") {
    queryParams.value.params['keyWord'] = keyWord.value;
  }
  listCourse(queryParams.value).then(response => {
    courseList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    name: null,
    coverUrl: null,
    times: null,
    noduleCount: null,
    favourCount: null,
    userId: null,
    intro: null,
    createTime: null,
    updateTime: null,
    isDelete: null,
    status: null,
    remark: null
  };
  proxy.resetForm("courseRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加课程";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getCourse(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改课程";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["courseRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateCourse(form.value).then(response => {
          modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCourse(form.value).then(response => {
          modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  modal.confirm('是否确认删除课程编号为"' + _ids + '"的数据项？').then(function () {
    return delCourse(_ids);
  }).then(() => {
    getList();
    modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

// 进入播放页
function handlePlay(row) {
  router.push({
    path: "/course/play",
    query: {
      courseId: row.id
    }
  })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('oj/course/export', {
    ...queryParams.value
  }, `course_${new Date().getTime()}.xlsx`)
}

getList();

// 审核状态
const options = [
  {
    value: 0,
    label: '等待审核',
  },
  {
    value: 1,
    label: '审核通过',
  },
  {
    value: 2,
    label: '不通过',
  }]

// 获取userShow列表
const userShows = ref();

const loadUserShows = async () => {
  getUserShowList().then(res => {
    userShows.value = res.data;
  });
}

loadUserShows();
</script>

<style lang="scss">
.row-ops {
  .el-button + .el-button {
    margin-left: initial !important;
  }
}

</style>
