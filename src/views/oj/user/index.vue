<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户名" prop="userName">
        <el-input
            v-model="queryParams.userName"
            placeholder="请输入用户名"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="角色" prop="userRole">-->
      <!--        <el-input-->
      <!--            v-model="queryParams.userRole"-->
      <!--            placeholder="请输入角色"-->
      <!--            clearable-->
      <!--            @keyup.enter="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="学校" prop="school">
        <el-input
            v-model="queryParams.school"
            placeholder="请输入学校"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="专业" prop="profession">
        <el-input
            v-model="queryParams.profession"
            placeholder="专业检索"
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
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            type="primary"-->
      <!--            plain-->
      <!--            icon="Plus"-->
      <!--            @click="handleAdd"-->
      <!--            v-hasPermi="['oj:user:add']"-->
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
            v-hasPermi="['oj:user:edit']"
        >修改
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            type="danger"-->
      <!--            plain-->
      <!--            icon="Delete"-->
      <!--            :disabled="multiple"-->
      <!--            @click="handleDelete"-->
      <!--            v-hasPermi="['oj:user:remove']"-->
      <!--        >删除-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['oj:user:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange"
              @sort-change="onSortChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="id" align="center" prop="id"/>-->
      <el-table-column label="账号" align="center" prop="userAccount"/>
      <el-table-column label="用户名" align="center" prop="userName"/>
      <el-table-column label="头像" align="center" prop="userAvatar" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.userAvatar" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <!--      <el-table-column label="角色" align="center" prop="userRole"/>-->
      <el-table-column label="学校" align="center" prop="school"/>
      <el-table-column label="专业" align="center" prop="profession"/>
      <!--      <el-table-column label="工作经验" align="center" prop="workExperience"/>-->
      <el-table-column label="做题数" align="center" prop="questionCount" sortable/>
      <el-table-column label="提交数" align="center" prop="submitCount" sortable/>
      <el-table-column label="通过数" align="center" prop="acceptedCount" sortable/>
      <el-table-column label="通过率" align="center" prop="acceptedRate" sortable/>
      <el-table-column label="个性签名" align="center" prop="personSign" width="150"/>
      <el-table-column label="在线状态" align="center" prop="activeStatus">
        <template #default="scope">
          <el-tag type="info" v-if="scope.row.activeStatus == 0">下线</el-tag>
          <el-tag type="success" v-else-if="scope.row.activeStatus == 1">在线</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="最近上下线时间" align="center" prop="lastOpsTime" width="180">
        <template #default="scope">
          <span>{{ scope.row.lastOpsTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="竞赛积分" align="center" prop="matchScore" sortable/>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <el-tag type="primary" v-if="scope.row.status == 0">正常</el-tag>
          <el-tag type="danger" v-else-if="scope.row.status == 1">封禁</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="updateTime" width="180">
        <template #default="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['oj:user:edit']">
            修改
          </el-button>
          <!--          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['oj:user:remove']">-->
          <!--            删除-->
          <!--          </el-button>-->
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

    <!-- 添加或修改用户对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="userRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户状态" prop="status">
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
          <el-input v-model="form.remark" placeholder="请输入备注"/>
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

<script setup name="User">
import {listUser, getUser, delUser, addUser, updateUser} from "@/api/oj/user";
import modal from "@/plugins/modal.js";
import {camelToSnake} from "@/utils/str.js";

const {proxy} = getCurrentInstance();

const userList = ref([]);
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
    userName: null,
    userRole: null,
    school: null,
    workExperience: null,
    activeStatus: null,
  },
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);

/** 查询用户列表 */
function getList() {
  loading.value = true;
  queryParams.value.sortParams = sortParams.value;
  console.log("queryParams", queryParams.value);
  listUser(queryParams.value).then(response => {
    userList.value = response.rows;
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
    userAccount: null,
    userPassword: null,
    unionId: null,
    mpOpenId: null,
    userName: null,
    userAvatar: null,
    userProfile: null,
    userRole: null,
    school: null,
    profession: null,
    workExperience: null,
    questionCount: null,
    acceptedRate: null,
    personSign: null,
    createTime: null,
    updateTime: null,
    isDelete: null,
    submitCount: null,
    acceptedCount: null,
    activeStatus: null,
    lastOpsTime: null,
    matchScore: null
  };
  proxy.resetForm("userRef");
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
  title.value = "添加用户";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getUser(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改用户";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["userRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateUser(form.value).then(response => {
          modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addUser(form.value).then(response => {
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
  modal.confirm('是否确认删除用户编号为"' + _ids + '"的数据项？').then(function () {
    return delUser(_ids);
  }).then(() => {
    getList();
    modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('oj/user/export', {
    ...queryParams.value
  }, `user_${new Date().getTime()}.xlsx`)
}

/**
 * onSortChange
 */
const sortParams = ref({});
const onSortChange = ({column, prop, order}) => {
  const field = camelToSnake(prop);
  sortParams.value = {};
  if (order == "ascending") {
    // alert("asc");
    sortParams.value[field] = "asc";
  } else if (order == "descending") {
    // alert("desc")
    sortParams.value[field] = "desc";
  }
  getList();
}


getList();
// 用户状态
const options = [
  {
    value: 0,
    label: '正常',
  },
  {
    value: 1,
    label: '封禁',
  }]
</script>
