<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="课程id" prop="courseId">
        <el-input
          v-model="queryParams.courseId"
          placeholder="请输入课程id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['oj:CourseVideo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['oj:CourseVideo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['oj:CourseVideo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['oj:CourseVideo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="CourseVideoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="课程id" align="center" prop="courseId" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="序号" align="center" prop="orderNo" />
      <el-table-column label="时长" align="center" prop="times" />
      <el-table-column label="封面" align="center" prop="coverUrl" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.coverUrl" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="视频" align="center" prop="videoUrl" />
      <el-table-column label="文件id" align="center" prop="fileId" />
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
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['oj:CourseVideo:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['oj:CourseVideo:remove']">删除</el-button>
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

    <!-- 添加或修改课程视频对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="CourseVideoRef" :model="form" :rules="rules" label-width="80px">
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

<script setup name="CourseVideo">
import { listCourseVideo, getCourseVideo, delCourseVideo, addCourseVideo, updateCourseVideo } from "@/api/oj/CourseVideo.js";
import modal from "@/plugins/modal.js";
const { proxy } = getCurrentInstance();

const CourseVideoList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    courseId: null,
    name: null,
    status: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询课程视频列表 */
function getList() {
  loading.value = true;
  listCourseVideo(queryParams.value).then(response => {
    CourseVideoList.value = response.rows;
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
    courseId: null,
    name: null,
    orderNo: null,
    times: null,
    coverUrl: null,
    videoUrl: null,
    fileId: null,
    createTime: null,
    updateTime: null,
    isDelete: null,
    status: null
  };
  proxy.resetForm("CourseVideoRef");
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
  title.value = "添加课程视频";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getCourseVideo(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改课程视频";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["CourseVideoRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateCourseVideo(form.value).then(response => {
          modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCourseVideo(form.value).then(response => {
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
  modal.confirm('是否确认删除课程视频编号为"' + _ids + '"的数据项？').then(function() {
    return delCourseVideo(_ids);
  }).then(() => {
    getList();
    modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('oj/CourseVideo/export', {
    ...queryParams.value
  }, `CourseVideo_${new Date().getTime()}.xlsx`)
}

getList();
</script>
