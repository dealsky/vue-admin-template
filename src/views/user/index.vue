<template>
  <div class="app-container">
    <el-form>
      <el-form-item>
        <el-button v-if="hasPerm('user:save')" type="primary" icon="el-icon-plus" @click="showDialog('create')">添加
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="拼命加载中"
      border
      highlight-current-row>
      <el-table-column label="序号" width="80">
        <template slot-scope="scope">
          <span>{{ getIndex(scope.$index) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="username"/>
      <el-table-column label="昵称" prop="nickname"/>
      <!--<el-table-column label="头像" prop="avatar"/>-->
      <el-table-column label="角色" prop="roleName" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.roleName === '管理员'" type="success" v-text="scope.row.roleName"/>
          <el-tag v-else type="primary" v-text="scope.row.roleName"/>
        </template>
      </el-table-column>
      <el-table-column label="管理" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="hasPerm('user:save')"
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="showDialog('update', scope.$index)">修改
          </el-button>
          <el-button
            v-if="scope.row.id !== userId && hasPerm('user:delete')"
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="deleteUser(scope.$index)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="listQuery.pageNumber"
      :limit.sync="listQuery.pageSize"
      :auto-scroll="false"
      @pagination="pageChange"/>
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dialogForm"
        :rules="rules"
        :model="currentUser"
        label-width="120px">
        <el-form-item label="用户名" prop="username" required>
          <el-input v-model="currentUser.username" class="form-input"/>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname" required>
          <el-input v-model="currentUser.nickname" class="form-input"/>
        </el-form-item>
        <el-form-item label="角色" prop="roleId" required>
          <el-select v-model="currentUser.roleId" class="form-input">
            <el-option v-for="role in roles" :key="role.value" :label="role.text" :value="role.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getList, saveUser, deleteUser } from '@/api/user'
import { getAll } from '@/api/role'
import Pagination from '@/components/Pagination/index'

const STATUS_CREATE = 'create'

export default {
  components: { Pagination },
  data() {
    return {
      list: [],
      roles: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      total: 0,
      dialogStatus: STATUS_CREATE,
      dialogFormVisible: false,
      dialogTitleMap: {
        create: '添加用户',
        update: '编辑'
      },
      currentUser: {
        id: '',
        username: '',
        nickname: '',
        roleId: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空' }
        ],
        nickname: [
          { required: true, message: '昵称不能为空' }
        ],
        roleId: [
          { required: true, message: '请选择角色' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  created() {
    this.fetchData()
    this.getAllRoles()
  },
  methods: {
    pageChange(listQuery) {
      this.listQuery.page = listQuery.page
      this.listQuery.limit = listQuery.limit
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      const pageable = {
        page: this.listQuery.page - 1,
        size: this.listQuery.limit
      }
      getList(pageable).then(response => {
        const data = response.data
        this.list = data.content
        this.total = data.totalElements
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getIndex($index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + $index + 1
    },
    getAllRoles() {
      getAll().then(res => {
        this.roles = res.data
      })
    },
    showDialog(status, index) {
      this.$nextTick(() => {
        if (this.$refs.dialogForm) {
          this.$refs.dialogForm.resetFields()
        }
        if (status === STATUS_CREATE) {
          this.currentUser.id = ''
          this.currentUser.username = ''
          this.currentUser.nickname = ''
          this.currentUser.roleId = ''
        } else {
          const current = this.list[index]
          this.currentUser.id = current.id
          this.currentUser.username = current.username
          this.currentUser.nickname = current.nickname
          this.currentUser.roleId = current.roleId.toString()
        }
        this.dialogStatus = status
        this.dialogFormVisible = true
      })
    },
    dialogConfirm() {
      this.$refs.dialogForm.validate((valid) => {
        if (!valid) {
          return false
        }

        let msg = ''
        if (this.dialogStatus === STATUS_CREATE) {
          msg = '添加成功'
        } else {
          if (this.userId === this.currentUser.id) {
            msg = '修改成功，部分信息重新登录后生效'
          } else {
            msg = '修改成功'
          }
        }

        saveUser(this.currentUser).then(() => {
          this.fetchData()
          this.dialogFormVisible = false
          this.$message({
            message: msg,
            type: 'success'
          })
        }).catch(() => {
        })
      })
    },
    deleteUser(index) {
      this.$confirm('确定删除此用户?', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        const userId = this.list[index].id
        deleteUser(userId).then(() => {
          this.fetchData()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(() => {
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.form-input {
  width: 200px;
}
</style>
