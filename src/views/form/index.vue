<template>
  <div class="app-container">
    <el-form v-model="form" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="form.name" class="form-input"/>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
          :show-file-list="false"
          :http-request="startUpload"
          :accept="acceptType"
          action=""
          class="avatar-uploader">
          <img v-if="form.image" :src="form.image" class="avatar" alt="">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
          <el-progress :percentage="uploadPercent" :text-inside="true" :stroke-width="18"/>
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
        image: '',
        imageCallback: ''
      },
      uploadPercent: 0,
      acceptType: 'image/png,image/jpeg,image/gif'
    }
  },
  methods: {
    startUpload(request) {
      this.uploadPercent = 0
      this.form.image = ''
      this.$message({
        message: '开始上传'
      })

      getUpladToken().then((res) => {
        const data = res.data
        const params = {
          'key': data.key,
          'policy': data.policy,
          'OSSAccessKeyId': data.OSSAccessKeyId,
          'success_action_status': '200',
          'callback': data.callback,
          'signature': data.signature
        }
        upload(data.host, request.file, params).then((res) => {
          this.form.image = data.host + '/' + res.data.data.filename

          this.$message({
            type: 'success',
            message: '上传成功'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '上传成功'
        })
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
  overflow: hidden;
}
</style>
