<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="群名检索">
        <el-input
            v-model="groupName"
            placeholder="请输入群名"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="群主">
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
      <el-form-item label="活跃时间" style="width: 308px">
        <el-date-picker
            v-model="daterangeActiveTime"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            unlink-panels
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="创建时间" style="width: 308px">
        <el-date-picker
            v-model="daterangeCreateTime"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            unlink-panels
        ></el-date-picker>
      </el-form-item>
<!--      <el-form-item label="更新时间" style="width: 308px">-->
<!--        <el-date-picker-->
<!--            v-model="daterangeUpdateTime"-->
<!--            value-format="YYYY-MM-DD"-->
<!--            type="daterange"-->
<!--            range-separator="-"-->
<!--            start-placeholder="开始日期"-->
<!--            end-placeholder="结束日期"-->
<!--            unlink-panels-->
<!--        ></el-date-picker>-->
<!--      </el-form-item>-->
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
<!--            v-hasPermi="['oj:room:add']"-->
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
            v-hasPermi="['oj:room:edit']"
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
<!--            v-hasPermi="['oj:room:remove']"-->
<!--        >删除-->
<!--        </el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['oj:room:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="roomList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!--            <el-table-column label="id" align="center" prop="id"/>-->
      <el-table-column label="群聊名称" align="center" prop="roomGroupList[0].name" width="200">
        <template #default="scope">
          <div style="display: flex; justify-content: center; align-items: center">
            {{ scope.row.roomGroupList[0]?.name }}
            <el-tag type="primary" v-if="scope.row.id == 1">总群</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center" prop="roomGroupList[0].avatar">
        <template #default="scope">
          <image-preview style="border-radius: 50%" v-if="scope.row.roomGroupList[0]?.avatar"
                         :src="scope.row.roomGroupList[0]?.avatar" :width="50" :height="50"/>
        </template>
      </el-table-column>
      >
      <el-table-column label="房间类型" align="center" prop="type">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.type == 0">私聊</el-tag>
          <el-tag type="success" v-else-if="scope.row.type == 1">群聊</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="群主" align="center" prop="userShowVO">
        <template #default="scope">
          <div style="display: flex; flex-direction: column; align-items: center" v-if="scope.row.userShowVO"
               :title="scope.row.userShowVO.userName">
            <img :src="scope.row.userShowVO.userAvatar" style="width: 25px; height: 25px; border-radius: 50%">
            <span>{{ scope.row.userShowVO.userName.slice(0, 5) }}<span
                v-if="scope.row.userShowVO.userName.length > 5">...</span></span>
          </div>
          <div v-else style="color: orange">系统</div>
        </template>
      </el-table-column>
      <el-table-column label="最近活跃时间" align="center" prop="activeTime" width="180">
        <template #default="scope">
          <span>{{ scope.row.activeTime }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="扩展消息" align="center" prop="extJson"/>-->
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template #default="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <el-tag type="primary" v-if="scope.row.status == 0">正常</el-tag>
          <el-tag type="success" v-else-if="scope.row.status == 1">解散</el-tag>
          <el-tag type="danger" v-else-if="scope.row.status == 2">封禁</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['oj:room:edit']">
            修改
          </el-button>
<!--          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['oj:room:remove']">-->
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

    <!-- 添加或修改聊天房间对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="roomRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="房间状态" prop="status">
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
        <!--        <el-divider content-position="center">群聊房间信息</el-divider>-->
        <!--        <el-row :gutter="10" class="mb8">-->
        <!--          <el-col :span="1.5">-->
        <!--            <el-button type="primary" icon="Plus" @click="handleAddRoomGroup">添加</el-button>-->
        <!--          </el-col>-->
        <!--          <el-col :span="1.5">-->
        <!--            <el-button type="danger" icon="Delete" @click="handleDeleteRoomGroup">删除</el-button>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <!--        <el-table :data="roomGroupList" :row-class-name="rowRoomGroupIndex"-->
        <!--                  @selection-change="handleRoomGroupSelectionChange" ref="roomGroup">-->
        <!--          <el-table-column type="selection" width="50" align="center"/>-->
        <!--          <el-table-column label="序号" align="center" prop="index" width="50"/>-->
        <!--          <el-table-column label="名称" prop="name" width="150">-->
        <!--            <template #default="scope">-->
        <!--              <el-input v-model="scope.row.name" placeholder="请输入名称"/>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--          <el-table-column label="头像" prop="avatar" width="150">-->
        <!--            <template #default="scope">-->
        <!--              <el-input v-model="scope.row.avatar" placeholder="请输入头像"/>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--          <el-table-column label="扩展信息" prop="extJson" width="150">-->
        <!--            <template #default="scope">-->
        <!--              <el-input v-model="scope.row.extJson" placeholder="请输入扩展信息"/>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--          <el-table-column label="创建时间" prop="createTime" width="240">-->
        <!--            <template #default="scope">-->
        <!--              <el-date-picker clearable-->
        <!--                              v-model="scope.row.createTime"-->
        <!--                              type="date"-->
        <!--                              value-format="YYYY-MM-DD"-->
        <!--                              placeholder="请选择创建时间">-->
        <!--              </el-date-picker>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--          <el-table-column label="更新时间" prop="updateTime" width="240">-->
        <!--            <template #default="scope">-->
        <!--              <el-date-picker clearable-->
        <!--                              v-model="scope.row.updateTime"-->
        <!--                              type="date"-->
        <!--                              value-format="YYYY-MM-DD"-->
        <!--                              placeholder="请选择更新时间">-->
        <!--              </el-date-picker>-->
        <!--            </template>-->
        <!--          </el-table-column>-->
        <!--        </el-table>-->
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

<script setup name="Room">
import {listRoom, getRoom, delRoom, addRoom, updateRoom} from "@/api/oj/room";
import modal from "@/plugins/modal.js";
import {ref} from "vue";
import {getUserShowList} from "@/api/oj/user.js";

const {proxy} = getCurrentInstance();

const roomList = ref([]);
const roomGroupList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const checkedRoomGroup = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangeActiveTime = ref([]);
const daterangeCreateTime = ref([]);
const daterangeUpdateTime = ref([]);
const groupName = ref("");
const userId = ref();

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    hotFlag: null,
    activeTime: null,
    createTime: null,
    updateTime: null,
    status: null,
  },
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);

/** 查询聊天房间列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (null != daterangeActiveTime.value && '' != daterangeActiveTime.value) {
    queryParams.value.params["beginActiveTime"] = daterangeActiveTime.value[0];
    queryParams.value.params["endActiveTime"] = daterangeActiveTime.value[1];
  }
  if (null != daterangeCreateTime.value && '' != daterangeCreateTime.value) {
    queryParams.value.params["beginCreateTime"] = daterangeCreateTime.value[0];
    queryParams.value.params["endCreateTime"] = daterangeCreateTime.value[1];
  }
  if (null != daterangeUpdateTime.value && '' != daterangeUpdateTime.value) {
    queryParams.value.params["beginUpdateTime"] = daterangeUpdateTime.value[0];
    queryParams.value.params["endUpdateTime"] = daterangeUpdateTime.value[1];
  }
  if (groupName.value) {
    queryParams.value.params["name"] = groupName.value;
  }
  if (userId.value) {
    queryParams.value.params["userId"] = userId.value;
  }
  listRoom(queryParams.value).then(response => {
    roomList.value = response.rows;
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
    type: null,
    hotFlag: null,
    activeTime: null,
    msgId: null,
    extJson: null,
    createTime: null,
    updateTime: null,
    isDelete: null,
    status: null,
    remark: null
  };
  roomGroupList.value = [];
  proxy.resetForm("roomRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeActiveTime.value = [];
  daterangeCreateTime.value = [];
  daterangeUpdateTime.value = [];
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
  title.value = "添加聊天房间";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getRoom(_id).then(response => {
    form.value = response.data;
    roomGroupList.value = response.data.roomGroupList;
    open.value = true;
    title.value = "修改聊天房间";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["roomRef"].validate(valid => {
    if (valid) {
      form.value.roomGroupList = roomGroupList.value;
      if (form.value.id != null) {
        updateRoom(form.value).then(response => {
          modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addRoom(form.value).then(response => {
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
  modal.confirm('是否确认删除聊天房间编号为"' + _ids + '"的数据项？').then(function () {
    return delRoom(_ids);
  }).then(() => {
    getList();
    modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 群聊房间序号 */
function rowRoomGroupIndex({row, rowIndex}) {
  row.index = rowIndex + 1;
}

/** 群聊房间添加按钮操作 */
function handleAddRoomGroup() {
  let obj = {};
  obj.name = "";
  obj.avatar = "";
  obj.extJson = "";
  obj.createTime = "";
  obj.updateTime = "";
  roomGroupList.value.push(obj);
}

/** 群聊房间删除按钮操作 */
function handleDeleteRoomGroup() {
  if (checkedRoomGroup.value.length == 0) {
    modal.msgError("请先选择要删除的群聊房间数据");
  } else {
    const roomGroups = roomGroupList.value;
    const checkedRoomGroups = checkedRoomGroup.value;
    roomGroupList.value = roomGroups.filter(function (item) {
      return checkedRoomGroups.indexOf(item.index) == -1
    });
  }
}

/** 复选框选中数据 */
function handleRoomGroupSelectionChange(selection) {
  checkedRoomGroup.value = selection.map(item => item.index)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('oj/room/export', {
    ...queryParams.value
  }, `room_${new Date().getTime()}.xlsx`)
}

getList();

// 房间状态
const options = [
  {
    value: 0,
    label: '正常',
  },
  {
    value: 2,
    label: '封禁',
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
