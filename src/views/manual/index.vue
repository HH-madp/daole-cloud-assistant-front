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
        :show-checkbox = "true"
        node-key="id"
        style="margin-top: 10px"
        class="filter-tree"
        default-expand-all
        @check="treeCheck"/>
    </div>
    <div class="rightContant">
      <!--创建子级按钮区-->
      <div class="y_title">
        <el-button type="primary" size="mini" @click="openLevelDialog">创建一级菜单</el-button>
        <el-button type="primary" size="mini" @click="createChildLevel">创建子级菜单</el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="菜单名称"
          width="260"/>
        <el-table-column
          :formatter="stateFormat"
          prop="parentId"
          label="菜单分级"
          width="260"/>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="createChildLevel(scope.row.id)">创建子级菜单</el-button>
            <el-button size="small" @click="get(scope.row.id)">编辑</el-button>
            <el-button size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      创建一级菜单弹出框-->
      <el-dialog :visible.sync="dialogFormVisible" title="创建一级菜单">
        <el-form :model="form">
          <el-form-item label-width="100px" label="菜单名称">
            <el-input v-model="form.name" auto-complete="off"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSave">确 定</el-button>
        </div>
      </el-dialog>
      <!--      创建子级菜单弹出框-->
      <el-dialog :visible.sync="dialogChileFormVisible" title="创建子级菜单">
        <el-form :model="form">
          <el-form-item label-width="100px" label="菜单名称">
            <el-input v-model="form.name" auto-complete="off"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleChildSave">确 定</el-button>
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
      tableData: [],
      filterText: '',
      // 创建一级菜单弹出框是否展示
      dialogFormVisible: false,
      // 创建子级菜单弹出框是否展示
      dialogChileFormVisible: false,
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
    // 左侧树结构获取所有树数据
    this.getLevels()
    // 右侧表格，初始化页面后默认获取一级菜单数据
    this.getLevelsByParentId(0)
  },
  methods: {
    // 树的过滤
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 树的单选框选择事件
    treeCheck(data) {
      this.form.parentId = data.id
    },
    // 获取所有节点信息
    getLevels() {
      assistanrApi.getLevel().then(res => {
        if (res.success) {
          this.treeData = res.data
        }
      })
    },
    // 根据父节点id获取该节点下的菜单数据
    getLevelsByParentId(parentId) {
      assistanrApi.getLevelByParentId(parentId).then(res => {
        if (res.success) {
          this.tableData = res.data
        } else {
          this.$message.error('查询失败')
        }
      })
    },
    // 右侧表格，处理菜单分级列的显示内容
    stateFormat(row, column) {
      if (row.parentId === 0) {
        return '一级菜单'
      } else {
        return '子级菜单'
      }
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
    },
    // 创建子级菜单弹出框
    createChildLevel(id) {
      this.dialogChileFormVisible = true
      this.form.parentId = id
    },
    // 子级菜单保存数据
    handleChildSave() {
      assistanrApi.save(this.form).then(res => {
        if (res.success) {
          this.$refs.tree.append(res.levelData, this.parentId)
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 2000
          })
          this.dialogChileFormVisible = false
          this.getLevels()
          this.form.parentId = 0
        } else {
          this.$message.error('创建失败')
        }
      })
    },
    // 根据id获取当前列的数据
    get(id) {
      assistanrApi.get(id).then(res => {
        if (res.success) {
          if (res.data.length > 0) {
            this.form = res.data[0]
            this.dialogChileFormVisible = true
          }
        } else {
          this.$message.error('查询失败')
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
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
