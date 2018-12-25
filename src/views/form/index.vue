<template>
  <div class="app-container">
    <el-form v-model="form">
      <el-form-item label="名称">
        <el-input v-model="form.name" class="form-input"/>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload"
          :data="dataObj"
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
export default {
  data() {
    return {
      form: {
        name: '',
        image: ''
      },
      dataObj: {
        token: '4q4D8SH7Xk1Ekrbz8kAoZ6AI2_9zEPxGSwQgR2TF:1uQ3iDe4hVoXrKtC_kdhmGcklcM=:eyJzY29wZSI6Im1lZGlhIiwiZGVhZGxpbmUiOjE1NDU3NTA5NDR9'
      }
    }
  },
  methods: {
    beforeUpload() {
      this.$message({
        message: '开始上传'
      })
    },
    handleUploadSuccess(res) {
      console.log(res)
      this.form.image = 'http://pk8vfro30.bkt.clouddn.com/' + res.key
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
  display: block;
}
</style>
