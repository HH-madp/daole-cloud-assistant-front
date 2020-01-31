<template>
  <div id="posu">
    <el-dialog :visible.sync="editFormVisible" :modal-append-to-body="false" center width="900px" height="600px">
      <p style="text-align: center"> {{ title }} </p>
      <p v-html="content"/>
    </el-dialog>
  </div>
</template>

<script>
import assistantApi from '@/api/assistant'

export default {
  components: {
  },
  data() {
    return {
      title: '',
      content: '',
      editFormVisible: false
    }
  },
  methods: {
    show(visible = true) {
      this.editFormVisible = visible
    },
    // 处理新建
    handleUpdate(id) {
      assistantApi.get(id).then(res => {
        if (res.msg === 'success') {
          this.title = res.data.title
          this.content = res.data.content
          // 为富文本框赋值
          this.show(true)
        } else {
          this.$message.error('保存失败')
        }
      })
      this.show()
    }
  }
}
</script>

<style scoped>

</style>
