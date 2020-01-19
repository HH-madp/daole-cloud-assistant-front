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
        :default-expand-all="false"
        node-key="id"
        style="margin-top: 10px"
        class="filter-tree"
        @node-click="treeCheck"/>
    </div>
    <div class="rightContant">
      <!--创建子级按钮区-->
      <div class="y_title">
        <el-button type="primary" size="mini" @click="createAssistant">创建手册</el-button>
      </div>
      <el-table
        :data="pageData.datalist"
        style="width: 100%">
        <el-table-column label="序号" type="index" width="180"/>
        <el-table-column
          prop="name"
          label="菜单名称"
          width="260"/>
        <el-table-column
          prop="parentId"
          label="菜单分级"
          width="260"/>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="createChildLevel(scope.row.id)">创建子级菜单</el-button>
            <el-button type="primary" size="small" @click="get(scope.row.id)">编辑</el-button>
            <el-button type="primary" size="small" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="pageData.datalist&&pageData.datalist.length>0" class="pagination-container">
        <el-pagination
          :current-page="pageData.pagenum"
          :total="pageData.totalelements"
          background
          layout="total, prev, pager, next, jumper"
          @current-change="handlePageNumChange"
        />
      </div>
      <assistant-edit ref="assistantEdit"/>
    </div>
  </div>
</template>
<script>
import assistanrApi from '@/api/assistant'
import assistantEdit from './assistantEdit'
import levelApi from '@/api/level'

export default {
  components: {
    assistantEdit
  },
  data() {
    return {
      // 右侧表格数据根据parentId进行查询，默认为0
      parentId: 0,
      // 过滤框提示文字
      filterText: '',
      // 创建一级菜单弹出框是否展示
      dialogFormVisible: false,
      // 创建子级菜单弹出框是否展示
      dialogChileFormVisible: false,
      levelId: '',
      // 分页数据
      pageData: {
        datalist: [],
        pagenum: 0,
        totalelements: 0,
        pagesize: 10
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
    // this.getLevelsByParentId(this.pageData.pagenum, this.pageData.pagesize, this.parentId)
  },
  methods: {
    // 树的过滤
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 树的点击事件
    treeCheck(data) {
      // 选择单选框创建子集菜单时，form表单的parentId为当前选择项的id
      this.levelId = data.id
      // 选择单选框,查询改菜单下的子集菜单，查询方法中的parentId为当前选择项的id
      // this.getLevelsByParentId(this.pageData.pagenum, this.pageData.pagesize, data.id)
    },
    // 获取所有节点信息
    getLevels() {
      levelApi.getLevel().then(res => {
        if (res.msg === 'success') {
          this.treeData = res.data
        }
      })
    },

    // 分页按钮点击事件
    handlePageNumChange(val) {
      assistanrApi.getLevelByParentId(val, this.pageData.pagesize, 0).then(res => {
        if (res.msg === 'success') {
          this.pageData.datalist = res.data.records
          this.pageData.pagenum = res.data.pages
          this.pageData.totalelements = res.data.total
        } else {
          this.$message.error('查询失败')
        }
      })
    },
    // 一级菜单保存数据
    handleSave() {
      assistanrApi.save(this.form).then(res => {
        if (res.msg === 'success') {
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 2000
          })
          this.dialogFormVisible = false
          this.resetEditFormData()
          // 一级菜单添加成功后，左侧树拉取新的数据
          this.getLevels()
          // 一级菜单添加成功后，右侧表格拉取新的一级菜单数据
          this.getLevelsByParentId(0, 10, 0)
        } else {
          this.$message.error('创建失败')
        }
      })
    },
    // 创建手册点击方法
    createAssistant() {
      this.$refs['assistantEdit'].handleCreate(this.levelId)
    },
    // 根据id获取当前列的数据
    get(id) {
    },
    // 根据id删除当前列的数据
    del(id) {
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
.pagination-container {
  text-align: center;
}
</style>
