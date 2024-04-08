<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input
            v-model="queryParams.title"
            placeholder="请输入标题"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户" prop="userId">
        <a-select v-model="queryParams.userId" :style="{width:'220px'}" allow-clear allow-search
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
      <!--            v-hasPermi="['oj:forum:add']"-->
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
            v-hasPermi="['oj:forum:edit']"
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
      <!--            v-hasPermi="['oj:forum:remove']"-->
      <!--        >删除-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['oj:forum:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="forumList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="id" align="center" prop="id"/>-->
      <el-table-column label="标题" align="center" prop="title"/>
      <el-table-column label="内容" align="center" prop="content">
        <template #default="scope">
          <span>{{ scope.row.content.slice(0, 30) }}</span>
          <span v-if="scope.row.content.length > 30">...</span>
        </template>
      </el-table-column>
      <el-table-column label="点赞数" align="center" prop="thumbNum"/>
      <el-table-column label="收藏数" align="center" prop="favourNum"/>
      <el-table-column label="评论数" align="center" prop="commentNum"/>
      <el-table-column label="用户Id" align="center" prop="userId">
        <template #default="scope">
          <div style="display: flex; flex-direction: column; align-items: center">
            <img :src="scope.row.user.userAvatar" style="width: 25px; height: 25px; border-radius: 50%">
            <span>{{ scope.row.user.userName.slice(0, 5) }}<span
                v-if="scope.row.user.userName.length > 5">...</span></span>
          </div>
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
      <el-table-column label="图片" align="center" prop="imgs">
        <template #default="scope">
          <image-preview v-if="scope.row.imgs" :src="scope.row.imgs ? JSON.parse(scope.row.imgs)[0] : null" :width="50"
                         :height="50"/>
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <div class="row-ops" style="display: flex; justify-content: center; align-items: center">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['oj:forum:edit']">
              修改
            </el-button>
            <!--            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"-->
            <!--                       v-hasPermi="['oj:forum:remove']">删除-->
            <!--            </el-button>-->
            <el-button link type="primary" @click="handleView(scope.row)"
                       v-hasPermi="['oj:forum:view']">
              <el-icon class="el-icon--left">
                <SvgIcon icon-class="view"/>
              </el-icon>
              阅览
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

    <!-- 添加或修改帖子对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="forumRef" :model="form" :rules="rules" label-width="80px">
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

<script setup name="Forum">
import {listForum, getForum, delForum, addForum, updateForum} from "@/api/oj/forum";
import {useForumStore} from "@/store/modules/forum.js";
import modal from "@/plugins/modal.js";
import SvgIcon from "@/components/SvgIcon/index.vue";
import {ref} from "vue";
import {getUserShowList} from "@/api/oj/user.js";

const {proxy} = getCurrentInstance();
const forumStore = useForumStore();

const forumList = ref([]);
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
    content: null,
    userId: null,
    status: null,
  },
  rules: {}
});

const {queryParams, form, rules} = toRefs(data);

/** 查询帖子列表 */
function getList() {
  loading.value = true;
  listForum(queryParams.value).then(response => {
    forumList.value = response.rows;
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
    thumbNum: null,
    favourNum: null,
    commentNum: null,
    userId: null,
    createTime: null,
    updateTime: null,
    isDelete: null,
    imgs: null,
    status: null,
    remark: null
  };
  proxy.resetForm("forumRef");
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
  title.value = "添加帖子";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getForum(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改帖子";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["forumRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateForum(form.value).then(response => {
          modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addForum(form.value).then(response => {
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
  modal.confirm('是否确认删除帖子编号为"' + _ids + '"的数据项？').then(function () {
    return delForum(_ids);
  }).then(() => {
    getList();
    modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

// 查看帖子详情
function handleView(row) {
  forumStore.open(row.id);
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('oj/forum/export', {
    ...queryParams.value
  }, `forum_${new Date().getTime()}.xlsx`)
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