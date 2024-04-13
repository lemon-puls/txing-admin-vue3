<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="title">
        <el-input
            v-model="queryParams.title"
            placeholder="请输入名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-input
            v-model="queryParams.tags"
            placeholder="请输入标签"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="用户id" prop="userId">-->
      <!--        <el-input-->
      <!--            v-model="queryParams.userId"-->
      <!--            placeholder="请输入用户id"-->
      <!--            clearable-->
      <!--            @keyup.enter="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
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
            v-hasPermi="['oj:question:add']"
        >新增
        </el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            type="success"-->
      <!--            plain-->
      <!--            icon="Edit"-->
      <!--            :disabled="single"-->
      <!--            @click="handleUpdate"-->
      <!--            v-hasPermi="['oj:question:edit']"-->
      <!--        >修改-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['oj:question:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['oj:question:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="questionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="id" align="center" prop="id"/>-->
      <el-table-column label="名称" align="center" prop="title"/>
      <el-table-column label="内容" align="center" prop="content">
        <template #default="scope">
          <span v-if="scope.row.content.length < 30">{{ scope.row.content }}</span>
          <span v-else>{{ scope.row.content.substr(0, 30) + " ..." }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签" align="center" prop="tags">
        <template #default="scope">
          <a-space wrap direction="horizonta">
            <a-tag v-for="(tag, index) of JSON.parse(scope.row.tags)" :key="index" color="green"
            >{{ tag }}
            </a-tag>
          </a-space>
        </template>
      </el-table-column>
      <el-table-column label="答案" align="center" prop="answer">
        <template #default="scope">
          <span v-if="scope.row.answer.length < 30">{{ scope.row.answer }}</span>
          <span v-else>{{ scope.row.answer.substr(0, 30) + " ..." }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交数" align="center" prop="submitNum"/>
      <el-table-column label="通过数" align="center" prop="acceptedNum"/>
      <el-table-column label="判题用例" align="center" prop="judgeCase">
        <template #default="scope">
        <span
            v-if="scope.row.judgeCase"
            style="color: #007bff; cursor: pointer"
            @click="handleClick(JSON.parse(scope.row.judgeCase))"
        >查看详情</span
        >
        </template>
      </el-table-column>
      <el-table-column label="判题配置" align="center" prop="judgeConfig">
        <template #default="scope">
          <a-space size="small" style="display: flex; flex-direction: column; row-gap: 10px">
            <a-tag bordered color="orange"
            >{{ JSON.parse(scope.row.judgeConfig).timeLimit }} ms
            </a-tag>
            <a-tag bordered color="blue"
            >{{
                `${(JSON.parse(scope.row.judgeConfig).memoryLimit / (1024 * 1024)).toFixed(
                    2
                )} MB`
              }}
            </a-tag>
          </a-space>
        </template>
      </el-table-column>
      <el-table-column label="点赞数" align="center" prop="thumbNum"/>
      <el-table-column label="收藏数" align="center" prop="favourNum"/>
<!--      <el-table-column label="用户id" align="center" prop="userId"/>-->
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row.id)"
                     v-hasPermi="['oj:question:edit']">
            修改
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['oj:question:remove']">删除
          </el-button>
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

    <!-- 添加或修改题目中心对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="questionRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-input v-model="form.tags" placeholder="请输入标签"/>
        </el-form-item>
        <el-form-item label="答案">
          <editor v-model="form.answer" :min-height="192"/>
        </el-form-item>
        <el-form-item label="判题用例" prop="judgeCase">
          <el-input v-model="form.judgeCase" placeholder="请输入判题用例"/>
        </el-form-item>
        <el-form-item label="判题配置" prop="judgeConfig">
          <el-input v-model="form.judgeConfig" placeholder="请输入判题配置"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <a-modal v-model:visible="judgeCaseViewerVisible" draggable :footer="false">
      <template #title> 测试用例</template>
      <div>
        <json-viewer
            v-if="currentJudgeCase"
            :value="currentJudgeCase"
            style="width: 100%; min-width: 3.125rem"
            :expand-depth="3"
            copyable
            boxed
            sort
            :show-array-index="true"
        ></json-viewer>
      </div>
    </a-modal>
  </div>
</template>

<script setup name="Question">
import {listQuestion, getQuestion, delQuestion, addQuestion, updateQuestion} from "@/api/oj/question";
import router from "@/router/index.js";
import modal from "@/plugins/modal.js";

const {proxy} = getCurrentInstance();


const questionList = ref([]);
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
    title: null,
    tags: null,
    userId: null,
  },
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);

/** 查询题目中心列表 */
function getList() {
  loading.value = true;
  loading.value = true;
  listQuestion(queryParams.value).then(response => {
    questionList.value = response.rows;
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
    title: null,
    content: null,
    tags: null,
    answer: null,
    submitNum: null,
    acceptedNum: null,
    judgeCase: null,
    judgeConfig: null,
    thumbNum: null,
    favourNum: null,
    userId: null,
    createTime: null,
    updateTime: null,
    isDelete: null
  };
  proxy.resetForm("questionRef");
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
  // reset();
  // open.value = true;
  // title.value = "添加题目中心";
  router.push({
    path: "/oj/question/add",
  })
}

/** 修改按钮操作 */
function handleUpdate(questionId) {
  // reset();
  // const _id = row.id || ids.value
  // getQuestion(_id).then(response => {
  //   form.value = response.data;
  //   open.value = true;
  //   title.value = "修改题目中心";
  // });
  router.push({
    path: '/oj/question/update',
    query: {
      questionId: questionId
    }
    // name: "Update",
    // params: {
    //   // Passing data through meta fields
    //   // meta: {
    //   //   data: JSON.stringify(row)
    //   // }
    //   data: JSON.stringify(row)
    // }
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["questionRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateQuestion(form.value).then(response => {
          modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addQuestion(form.value).then(response => {
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
  modal.confirm('是否确认删除题目中心编号为"' + _ids + '"的数据项？').then(function () {
    return delQuestion(_ids);
  }).then(() => {
    getList();
    modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('oj/question/export', {
    ...queryParams.value
  }, `question_${new Date().getTime()}.xlsx`)
}

getList();

/**
 * 测试用例查看对话框
 */
const judgeCaseViewerVisible = ref(false);
let currentJudgeCase = ref();
const handleClick = (record) => {
  currentJudgeCase.value = record;
  judgeCaseViewerVisible.value = true;
};
</script>
