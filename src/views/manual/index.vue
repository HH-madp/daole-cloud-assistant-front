<template>
  <div style="width: 100%;height: 100%">
    <div class="leftTree" >
      <el-input
        v-model="filterText"
        style="height: 40px"
        placeholder="输入关键字进行过滤"/>
      <el-tree
        ref="tree"
        :filter-node-method="filterNode"
        :data="treeData"
        :props="defaultProps"
        style="margin-top: 10px"
        class="filter-tree"
        default-expand-all/>
    </div>
    <div class="rightContant">
      <!--创建子级按钮区-->
      <div class="y_title">
        <el-button type="primary" size="mini" @click="openLevelDialog">创建一级菜单</el-button>
        <el-button type="primary" size="mini">创建子级菜单</el-button>
      </div>
      <!--      创建一级菜单弹出框-->
      <el-dialog :visible.sync="dialogFormVisible" title="创建一级菜单">
        <el-form :model="form">
          <el-form-item label-width="100px" label="菜单名称">
            <el-input v-model="form.name" autocomplete="off"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSave">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import assistanrApi from '@/api/assistant'

export default {
  data() {
    return {
      filterText: '',
      // 创建一级菜单弹出框是否展示
      dialogFormVisible: false,

      form: {
        name: '',
        parentId: 0
      },
      // 菜单树数据集合
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getLevels()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 获取所有节点信息
    getLevels() {
      assistanrApi.getLevel().then(res => {
        if (res.success) {
          this.treeData = res.data
        }
      })
    },
    // 弹出一级菜单框
    openLevelDialog() {
      this.dialogFormVisible = true
    },
    // 一级菜单保存数据
    handleSave() {
      assistanrApi.save(this.form).then(res => {
        if (res.success) {
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 2000
          })
          this.dialogFormVisible = false
          this.getLevels()
        } else {
          this.$message.error('创建失败')
        }
      })
    }
  }
}
</script>

<style scoped>
.leftTree {
  width: 15%;
  height: 100%;
  border-right: 1px solid #e6e6e6;
  position: absolute
}
el-tree{
  margin-top: 5px;
}
.rightContant {
  width: 85%;
  height: 100%;
  float: right;
  }
.y_title {
  border: none;
  border-bottom: solid #ebeef5 1px;
  height: 40px;
  text-align: right;
  line-height: 40px;
}
</style>
