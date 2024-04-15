<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户">
        <a-select v-model="userId" :style="{width:'220px'}" allow-clear allow-search
                  placeholder="指定用户查看...">
          <a-option v-for="user in userShows" :value="user.id"
                    :label="user.userName" :key="user.id">
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
      <!--      <el-form-item label="结束时间" style="width: 308px">-->
      <!--        <el-date-picker-->
      <!--            v-model="daterangeEndTime"-->
      <!--            value-format="YYYY-MM-DD"-->
      <!--            type="daterange"-->
      <!--            range-separator="-"-->
      <!--            start-placeholder="开始日期"-->
      <!--            end-placeholder="结束日期"-->
      <!--        ></el-date-picker>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="赢家id" prop="winnerId">-->
      <!--        <el-input-->
      <!--            v-model="queryParams.winnerId"-->
      <!--            placeholder="请输入赢家id"-->
      <!--            clearable-->
      <!--            @keyup.enter="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
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
      <!--            v-hasPermi="['oj:onlinepk:add']"-->
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
      <!--            v-hasPermi="['oj:onlinepk:edit']"-->
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

    <el-table v-loading="loading" :data="onlinepkList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="id" align="center" prop="id"/>-->
      <el-table-column width="200" label="用户1" align="center" prop="user1">
        <template #default="scope">
          <div style="display: flex; flex-direction: column; align-items: center">
            <img :src="scope.row.user1.userAvatar" style="width: 25px; height: 25px; border-radius: 50%">
            <span>{{ scope.row.user1.userName.slice(0, 10) }}<span
                v-if="scope.row.user1.userName.length > 10">...</span>
            </span>
            <div>
              <el-tag style="margin-right: 10px"
                      type="warning"
                      effect="plain">
                {{ scope.row.score1 }}分
              </el-tag>
              <el-tag type="primary"
                      v-if="scope.row.winnerId == scope.row.userId1">胜方
              </el-tag>
              <el-tag type="danger"
                      v-else>败方
              </el-tag>
            </div>

          </div>
        </template>
      </el-table-column>
      <el-table-column width="200" label="用户2" align="center" prop="user2">
        <template #default="scope">
          <div style="display: flex; flex-direction: column; align-items: center">
            <img :src="scope.row.user2.userAvatar" style="width: 25px; height: 25px; border-radius: 50%">
            <span>{{ scope.row.user2.userName.slice(0, 10) }}<span
                v-if="scope.row.user2.userName.length > 10">...</span>
            </span>

            <div>
              <el-tag style="margin-right: 10px"
                      type="warning"
                      effect="plain">
                {{ scope.row.score1 }}分
              </el-tag>
              <el-tag type="primary"
                      v-if="scope.row.winnerId == scope.row.userId2">胜方
              </el-tag>
              <el-tag type="danger"
                      v-else>败方
              </el-tag>
            </div>

          </div>
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
      <el-table-column label="提交时间1" align="center" prop="submitTime1" width="180">
        <template #default="scope">
          <span>{{ scope.row.submitTime1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间2" align="center" prop="submitTime2" width="180">
        <template #default="scope">
          <span>{{ scope.row.submitTime2 }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="提交ID1" align="center" prop="submitId1"/>-->
      <!--      <el-table-column label="提交ID2" align="center" prop="submitId2"/>-->
      <!--      <el-table-column label="赢家id" align="center" prop="winnerId"/>-->
      <el-table-column :width="150" label="竞赛题目" align="center" prop="question">
        <template #default="scope">
          <span>{{ scope.row.question.title ? scope.row.question.title : "题目已被删除" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <el-tag type="primary" v-if="scope.row.status == 0">未开始</el-tag>
          <el-tag type="warning" v-else-if="scope.row.status == 1">进行中</el-tag>
          <el-tag type="success" v-else-if="scope.row.status == 2">已结束</el-tag>
        </template>
      </el-table-column>
      <!--      <el-table-column label="分数1" align="center" prop="score1"/>-->
      <!--      <el-table-column label="分数2" align="center" prop="score2"/>-->
      <!--      <el-table-column label="创建时间" align="center" prop="createTime" width="180">-->
      <!--        <template #default="scope">-->
      <!--          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">-->
      <!--        <template #default="scope">-->
      <!--          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <!--          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['oj:onlinepk:edit']">-->
          <!--            修改-->
          <!--          </el-button>-->
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
          >删除
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

    <!-- 添加或修改在线PK对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="onlinepkRef" :model="form" :rules="rules" label-width="80px">
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

<script setup name="Onlinepk">
import {listOnlinepk, getOnlinepk, delOnlinepk, addOnlinepk, updateOnlinepk} from "@/api/oj/onlinepk";
import modal from "@/plugins/modal.js";
import {ref} from "vue";
import {getUserShowList} from "@/api/oj/user.js";

const {proxy} = getCurrentInstance();

const onlinepkList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangeStartTime = ref([]);
const daterangeEndTime = ref([]);
const userId = ref();

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId1: null,
    userId2: null,
    startTime: null,
    endTime: null,
    winnerId: null,
    status: null,
  },
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);

/** 查询在线PK列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (daterangeStartTime.value && null != daterangeStartTime && '' != daterangeStartTime) {
    queryParams.value.params["beginStartTime"] = daterangeStartTime.value[0];
    queryParams.value.params["endStartTime"] = daterangeStartTime.value[1];
  }
  if (userId.value) {
    queryParams.value.params["userId"] = userId.value;
  }
  // if (null != daterangeEndTime && '' != daterangeEndTime) {
  //   queryParams.value.params["beginEndTime"] = daterangeEndTime.value[0];
  //   queryParams.value.params["endEndTime"] = daterangeEndTime.value[1];
  // }
  listOnlinepk(queryParams.value).then(response => {
    onlinepkList.value = response.rows;
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
    userId1: null,
    userId2: null,
    startTime: null,
    endTime: null,
    submitTime1: null,
    submitTime2: null,
    submitId1: null,
    submitId2: null,
    winnerId: null,
    questionId: null,
    status: null,
    score1: null,
    score2: null,
    createTime: null,
    updateTime: null,
    isDelete: null
  };
  proxy.resetForm("onlinepkRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeStartTime.value = [];
  daterangeEndTime.value = [];
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
  title.value = "添加在线PK";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getOnlinepk(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改在线PK";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["onlinepkRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateOnlinepk(form.value).then(response => {
          modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addOnlinepk(form.value).then(response => {
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
  modal.confirm('是否确认删除在线PK编号为"' + _ids + '"的数据项？').then(function () {
    return delOnlinepk(_ids);
  }).then(() => {
    getList();
    modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('oj/onlinepk/export', {
    ...queryParams.value
  }, `onlinepk_${new Date().getTime()}.xlsx`)
}

// 获取userShow列表
const userShows = ref();

const loadUserShows = async () => {
  getUserShowList().then(res => {
    userShows.value = res.data;
  });
}
// 比赛状态
const options = [
  // {
  //   value: 0,
  //   label: '未开始',
  // },
  {
    value: 1,
    label: '进行中',
  },
  {
    value: 2,
    label: '已结束',
  }]

getList();
loadUserShows();
</script>
