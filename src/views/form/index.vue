<template>
  <div class="app-container">
    <el-form v-model="form">
      <el-form-item label="名称">
        <el-input v-model="form.name" class="form-input"/>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
          :show-file-list="false"
          :http-request="startUpload"
          :accept="acceptType"
          class="avatar-uploader"
          action="http://upload.qiniup.com">
          <img v-if="form.image" :src="form.image" class="avatar" alt="">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { upload, getUpladToken } from '@/api/upload'

export default {
  data() {
    return {
      form: {
        name: '',
        image: ''
      },
      acceptType: 'image/png,image/jpeg'
    }
  },
  methods: {
    startUpload(request) {
      this.$message({
        message: '开始上传'
      })

      getUpladToken().then((res) => {
        upload(
          res.data,
          request,
          next => {
            console.log(next)
          },
          error => {
            this.$message({
              type: 'error',
              message: '上传失败'
            })
            console.log(error)
          },
          complete => {
            this.form.image = 'http://pk8vfro30.bkt.clouddn.com/' + complete.key
            this.$message({
              type: 'success',
              message: '上传成功'
            })
          })
      }).catch(() => {
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.form-input {
  width: 300px;
}

.avatar-uploader {
  .avatar-uploader-icon {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader-icon:hover {
    border-color: #409EFF;
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
