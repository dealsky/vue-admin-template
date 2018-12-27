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
          :action="uploadAction"
          class="avatar-uploader">
          <img v-if="form.image" :src="form.image" class="avatar" alt="">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
          <el-progress :percentage="uploadPercent" :text-inside="true" :stroke-width="18"/>
        </el-upload>
      </el-form-item>
      <el-form-item label="图片(回调上传)">
        <el-upload
          :show-file-list="false"
          :http-request="startUploadCallback"
          :accept="acceptType"
          :action="uploadAction"
          class="avatar-uploader">
          <img v-if="form.imageCallback" :src="form.imageCallback" class="avatar" alt="">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { upload, getUpladToken, getCallbackUploadToken, CDN_DOMAIN, UPLOAD_ACTION } from '@/api/upload'

export default {
  data() {
    return {
      form: {
        name: '',
        image: '',
        imageCallback: ''
      },
      uploadPercent: 0,
      uploadAction: UPLOAD_ACTION,
      acceptType: 'image/png,image/jpeg'
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
        upload({
          token: res.data,
          request: request,
          mimeType: ['image/png', 'image/jpeg']
        }, this.uploadNext, this.uploadError, this.uploadComplete)
      }).catch(() => {
      })
    },
    startUploadCallback(request) {
      this.form.imageCallback = ''
      this.$message({
        message: '开始上传'
      })

      const options = {
        action: '/common/upload/testCallback',
        extra: {
          fname: '$(fname)'
        }
      }

      getCallbackUploadToken(options).then((res) => {
        upload({
          token: res.data,
          request: request
        }, () => {
        }, this.uploadError, this.uploadCompleteCallback)
      }).catch(() => {
      })
    },
    uploadNext(res) {
      this.uploadPercent = parseInt(res.total.percent)
    },
    uploadError(error) {
      console.log(error)
      this.$message({
        type: 'error',
        message: '上传失败'
      })
    },
    uploadComplete(res) {
      this.form.image = CDN_DOMAIN + res.key
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    uploadCompleteCallback(res) {
      this.form.imageCallback = CDN_DOMAIN + res.key
      this.$message({
        type: 'success',
        message: '上传成功'
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
