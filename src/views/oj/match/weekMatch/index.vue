<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <!--      <el-form-item label="名称" prop="name">-->
      <!--        <el-input-->
      <!--            v-model="queryParams.name"-->
      <!--            placeholder="请输入名称"-->
      <!--            clearable-->
      <!--            @keyup.enter="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="场次" prop="sessionNo">
        <el-input
            v-model="queryParams.sessionNo"
            placeholder="请输入场次"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" style="width: 308px">
        <el-date-picker
            v-model="daterangeStartTime"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            unlink-panels
        ></el-date-picker>
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
      <!--            v-hasPermi="['oj:weekMatch:add']"-->
      <!--        >新增-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['oj:weekMatch:edit']"
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
            v-hasPermi="['oj:weekMatch:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['oj:weekMatch:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Plus"
            @click="handleCreateMatch"
            v-hasPermi="['oj:weekMatch:create']"
        >生成下场比赛
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="weekMatchList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="id" align="center" prop="id" />-->
      <el-table-column label="名称" align="center" prop="name"/>
      <el-table-column label="场次" align="center" prop="sessionNo"/>
      <el-table-column :width="200" label="竞赛题目" align="left" prop="questions">
        <template #default="scope">
          <p v-for="(question, index) in scope.row.questions">{{
              index + 1
            }}、{{ question.title ? question.title : "该题目已被删除" }}</p>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="180">
        <template #default="scope">
          <span>{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <el-tag type="primary" v-if="scope.row.status == 0">未开始</el-tag>
          <el-tag type="success" v-else-if="scope.row.status == 1">进行中</el-tag>
          <el-tag type="success" v-else-if="scope.row.status == 2">已结束</el-tag>
          <el-tag type="success" v-else-if="scope.row.status == 3">完成判题</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="参与人数" align="center" prop="joinCount"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="updateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['oj:weekMatch:edit']">修改
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['oj:weekMatch:remove']">删除
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

    <!-- 添加或修改周赛对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="weekMatchRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="场次" prop="sessionNo">
          <el-input v-model="form.sessionNo" placeholder="请输入场次"/>
        </el-form-item>
        <!--        <el-form-item label="开始时间" prop="startTime">-->
        <!--          <el-date-picker clearable-->
        <!--                          v-model="form.startTime"-->
        <!--                          type="datetime"-->
        <!--                          value-format="YYYY-MM-DD HH:mm:ss"-->
        <!--                          placeholder="请选择开始时间">-->
        <!--          </el-date-picker>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="结束时间" prop="endTime">-->
        <!--          <el-date-picker clearable-->
        <!--                          v-model="form.endTime"-->
        <!--                          type="datetime"-->
        <!--                          value-format="YYYY-MM-DD HH:mm:ss"-->
        <!--                          placeholder="请选择结束时间">-->
        <!--          </el-date-picker>-->
        <!--        </el-form-item>-->
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

<script setup name="WeekMatch">
import {listWeekMatch, getWeekMatch, delWeekMatch, addWeekMatch, updateWeekMatch} from "@/api/oj/weekMatch";
import modal from "@/plugins/modal.js";
import {ref} from "vue";

const {proxy} = getCurrentInstance();

const weekMatchList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangeStartTime = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    sessionNo: null,
    startTime: null,
    endTime: null,
    status: null,
  },
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);

/** 查询周赛列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (daterangeStartTime.value && null != daterangeStartTime && '' != daterangeStartTime && daterangeStartTime.value.length > 0) {
    queryParams.value.params["beginStartTime"] = daterangeStartTime.value[0];
    queryParams.value.params["endStartTime"] = daterangeStartTime.value[1];
  }
  listWeekMatch(queryParams.value).then(response => {
    weekMatchList.value = response.rows;
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
    sessionNo: null,
    startTime: null,
    endTime: null,
    status: null,
    joinCount: null,
    createTime: null,
    updateTime: null,
    isDelete: null
  };
  proxy.resetForm("weekMatchRef");
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
  title.value = "添加周赛";
}

// 创建下一场比赛
function handleCreateMatch() {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:8121/api/match/week/create', true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        if (data.code != 0) {
          modal.msgWarning(data.data);
          return;
        }
        getList();
        modal.msgSuccess("创建成功");
      } else {
        modal.msgError("创建失败，请稍后重试！");
      }
    }
  };
  xhr.send();
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getWeekMatch(_id).then(response => {
    form.value = response.data;
    // form.value.startTime = new Date(form.value.startTime);
    // form.value.endTime = new Date(form.value.endTime);
    open.value = true;
    title.value = "修改周赛";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["weekMatchRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateWeekMatch(form.value).then(response => {
          modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addWeekMatch(form.value).then(response => {
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
  modal.confirm('是否确认删除周赛编号为"' + _ids + '"的数据项？').then(function () {
    return delWeekMatch(_ids);
  }).then(() => {
    getList();
    modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('oj/weekMatch/export', {
    ...queryParams.value
  }, `weekMatch_${new Date().getTime()}.xlsx`)
}

getList();
</script>
