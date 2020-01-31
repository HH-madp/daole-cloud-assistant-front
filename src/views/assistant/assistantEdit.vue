<template>
  <div id="posu">
    <el-dialog :title="title" :visible.sync="editFormVisible" :modal-append-to-body="false" center width="900px">
      <el-form ref="editForm" :rules="editFormRules" :model="editFormData" label-position="left" label-width="90px" style="width: 800px; margin-left:30px;">
        <el-form-item label="手册标题" prop="title">
          <el-input v-model="editFormData.title" maxlength="40" placeholder="40字以内"/>
        </el-form-item>
        <el-form-item label="手册内容" prop="content">
          <ueditor ref="ueditcontent" v-model="editFormData.content"/>
        </el-form-item>-
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible=false">取消</el-button>
        <el-button @click="handleSave">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ueditor from '@/components/ueditor/index'
import assistantApi from '@/api/assistant'

export default {
  components: {
    ueditor
  },
  data() {
    return {
      title: '',
      editFormVisible: false,
      editFormData: {},
      editFormRules: {
        title: [{ required: true, message: '手册标题必须填写' }],
        content: [{ required: true, message: '手册内容必须填写' }]
      }
    }
  },
  methods: {
    show(visible = true) {
      this.editFormVisible = visible
    },
    // 处理新建
    handleCreate(levelId, leName, title = '新建手册信息') {
      if (levelId === undefined || levelId === '') {
        this.$message.error('新建手册前请选择分类')
        return
      } else {
        this.editFormData.leId = levelId
        this.editFormData.leName = leName
      }
      this.title = title
      this.show()
    },
    // 处理更新
    handleUpdate(id, title = '编辑手册信息') {
      assistantApi.get(id).then(res => {
        if (res.msg === 'success') {
          this.editFormData = res.data
          // 为富文本框赋值
          this.$refs['ueditcontent'].setContent(res.data.content)
          this.show(true)
        } else {
          this.$message.error('保存失败')
        }
      })
      this.title = title
      this.show()
    },
    // 处理保存
    handleSave() {
      // 获取富文本框的值
      // 将获取富文本框的值赋值给 editFormData.content
      this.editFormData.content = this.$refs['ueditcontent'].getContent()
      assistantApi.save(this.editFormData).then(res => {
        if (res.msg === 'success') {
          this.$notify({
            title: '成功',
            message: res.message || '保存成功',
            type: 'success',
            duration: 2000
          })
          this.$emit('success', 0, 10, this.editFormData.leId)
          this.show(false)
          this.editFormData = {}
          this.$refs['ueditcontent'].setContent('')
        } else {
          this.$message.error('保存失败')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
