<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="比赛id" prop="matchId">
        <el-input
            v-model="queryParams.matchId"
            placeholder="请输入比赛id"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="题目id" prop="questionId">
        <el-input
            v-model="queryParams.questionId"
            placeholder="请输入题目id"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="题目序号" prop="questionOrder">
        <el-input
            v-model="queryParams.questionOrder"
            placeholder="请输入题目序号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否删除" prop="isDelete">
        <el-input
            v-model="queryParams.isDelete"
            placeholder="请输入是否删除"
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
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
        >删除
        </el-button>
      </el-col>
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

    <el-table v-loading="loading" :data="MatchWeekQuestionRelateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="id" align="center" prop="id"/>
      <el-table-column label="比赛id" align="center" prop="matchId"/>
      <el-table-column label="题目id" align="center" prop="questionId"/>
      <el-table-column label="题目序号" align="center" prop="questionOrder"/>
      <el-table-column label="是否删除" align="center" prop="isDelete"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
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

    <!-- 添加或修改周赛题目关联对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="MatchWeekQuestionRelateRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="比赛id" prop="matchId">
          <el-input v-model="form.matchId" placeholder="请输入比赛id"/>
        </el-form-item>
        <el-form-item label="题目id" prop="questionId">
          <el-input v-model="form.questionId" placeholder="请输入题目id"/>
        </el-form-item>
        <el-form-item label="题目序号" prop="questionOrder">
          <el-input v-model="form.questionOrder" placeholder="请输入题目序号"/>
        </el-form-item>
        <el-form-item label="是否删除" prop="isDelete">
          <el-input v-model="form.isDelete" placeholder="请输入是否删除"/>
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

<script setup name="MatchWeekQuestionRelate">
import {
  listMatchWeekQuestionRelate,
  getMatchWeekQuestionRelate,
  delMatchWeekQuestionRelate,
  addMatchWeekQuestionRelate,
  updateMatchWeekQuestionRelate
} from "@/api/oj/MatchWeekQuestionRelate";
import modal from "@/plugins/modal.js";

const {proxy} = getCurrentInstance();

const MatchWeekQuestionRelateList = ref([]);
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
    matchId: null,
    questionId: null,
    questionOrder: null,
    isDelete: null
  },
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);

/** 查询周赛题目关联列表 */
function getList() {
  loading.value = true;
  listMatchWeekQuestionRelate(queryParams.value).then(response => {
    MatchWeekQuestionRelateList.value = response.rows;
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
    matchId: null,
    questionId: null,
    questionOrder: null,
    createTime: null,
    updateTime: null,
    isDelete: null
  };
  proxy.resetForm("MatchWeekQuestionRelateRef");
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
  title.value = "添加周赛题目关联";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getMatchWeekQuestionRelate(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改周赛题目关联";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["MatchWeekQuestionRelateRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateMatchWeekQuestionRelate(form.value).then(response => {
          modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addMatchWeekQuestionRelate(form.value).then(response => {
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
  modal.confirm('是否确认删除周赛题目关联编号为"' + _ids + '"的数据项？').then(function () {
    return delMatchWeekQuestionRelate(_ids);
  }).then(() => {
    getList();
    modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('oj/MatchWeekQuestionRelate/export', {
    ...queryParams.value
  }, `MatchWeekQuestionRelate_${new Date().getTime()}.xlsx`)
}

getList();
</script>
