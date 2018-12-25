<template>
  <div class="app-container">
    <el-form>
      <el-form-item>
        <el-button v-if="hasPerm('role:save')" type="primary" icon="el-icon-plus" @click="showDialog('create')">添加
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
      <el-table-column label="角色名" prop="name" width="140"/>
      <el-table-column label="描述" prop="description"/>
      <el-table-column label="管理" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="hasPerm('role:save')"
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="showDialog('update', scope.$index)">修改
          </el-button>
          <el-button
            v-if="hasPerm('role:delete')"
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="deleteRole(scope.$index)">删除
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
        ref="adminForm"
        :rules="rules"
        :model="currentRole"
        label-width="120px">
        <el-form-item label="角色名" prop="name" required>
          <el-input v-model="currentRole.name" class="form-input"/>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="currentRole.description" type="textarea" class="form-input"/>
        </el-form-item>
        <el-form-item label="权限">
          <div v-for="(menu, index) in menus" :key="menu.id">
            <el-button
              :type="checkAllSelect(menu) ? 'success' : ''"
              size="mini"
              @click="selectMenu(index)">{{ menu.name }}
            </el-button>
            <el-checkbox-group v-model="currentRole.permissions" class="permission-list">
              <el-checkbox
                v-for="permission in menu.permissions"
                :label="permission.code"
                :key="permission.id"
                type="checkbox"
                @change="checkRequired($event, permission, index)">
                <span>{{ permission.name }}</span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
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
import { getList, saveRole, deleteRole } from '@/api/role'
import { getAllPermissions } from '@/api/permission'
import Pagination from '@/components/Pagination/index'

const STATUS_CREATE = 'create'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      list: [],
      menus: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      total: 0,
      dialogStatus: STATUS_CREATE,
      dialogFormVisible: false,
      dialogTitleMap: {
        create: '添加角色',
        update: '编辑'
      },
      currentRole: {
        id: '',
        name: '',
        description: '',
        permissions: []
      },
      rules: {
        name: [
          { required: true, message: '角色名不能为空' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
    this.getAllPermissions()
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
    getAllPermissions() {
      getAllPermissions().then((res) => {
        this.menus = res.data
      }).catch(() => {
      })
    },
    containsPermission(permission) {
      return this.currentRole.permissions.indexOf(permission.code) !== -1
    },
    checkAllSelect(menu) {
      for (const permission of menu.permissions) {
        if (!this.containsPermission(permission)) {
          return false
        }
      }
      return true
    },
    selectMenu(index) {
      const menu = this.menus[index]
      if (this.checkAllSelect(menu)) {
        // 取消全选
        for (const permission of menu.permissions) {
          const index = this.currentRole.permissions.indexOf(permission.code)
          if (index !== -1) {
            this.currentRole.permissions.splice(index, 1)
          }
        }
      } else {
        // 全选
        for (const permission of menu.permissions) {
          if (!this.containsPermission(permission)) {
            this.currentRole.permissions.push(permission.code)
          }
        }
      }
    },
    checkRequired(e, permission, index) {
      const menu = this.menus[index]
      if (!permission.required && e) {
        for (const perm of menu.permissions) {
          if (perm.required && !this.containsPermission(perm)) {
            this.currentRole.permissions.push(perm.code)
          }
        }
      } else if (permission.required && !e) {
        for (const perm of menu.permissions) {
          if (!perm.required && this.containsPermission(perm)) {
            const permissionIndex = this.currentRole.permissions.indexOf(perm.code)
            this.currentRole.permissions.splice(permissionIndex, 1)
          }
        }
      }
    },
    showDialog(status, index) {
      this.$nextTick(() => {
        if (this.$refs.adminForm) {
          this.$refs.adminForm.resetFields()
        }
        if (status === STATUS_CREATE) {
          this.currentRole.id = ''
          this.currentRole.name = ''
          this.currentRole.description = ''
          this.currentRole.permissions = []
        } else {
          const current = this.list[index]
          this.currentRole.id = current.id
          this.currentRole.name = current.name
          this.currentRole.description = current.description
          this.currentRole.permissions = current.permissions.slice(0)
        }
        this.dialogStatus = status
        this.dialogFormVisible = true
      })
    },
    dialogConfirm() {
      this.$refs.adminForm.validate((valid) => {
        if (!valid) {
          return false
        }

        let msg = ''
        if (this.dialogStatus === STATUS_CREATE) {
          msg = '添加成功'
        } else {
          msg = '修改成功'
        }

        saveRole(this.currentRole).then(() => {
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
    deleteRole(index) {
      this.$confirm('确定删除此角色?', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        const roleId = this.list[index].id
        deleteRole(roleId).then(() => {
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

.permission-list {
  display: inline-block;
  margin-left: 20px;
}
</style>
