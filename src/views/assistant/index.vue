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
          prop="title"
          label="菜单名称"
          width="260"/>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="createChildLevel(scope.row.id)">查看</el-button>
            <el-button type="primary" size="small" @click="updateAssistant(scope.row.id)">编辑</el-button>
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
import assistantApi from '@/api/assistant'
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
    // 右侧表格，获取手册信息
    this.handquery(this.pageData.pagenum, this.pageData.pagesize, this.levelId)
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
    },
    // 获取所有节点信息
    getLevels() {
      levelApi.getLevel().then(res => {
        if (res.msg === 'success') {
          this.treeData = res.data
        }
      })
    },
    // 获取右侧手册表格数据列表
    handquery(pageNum = 0, pageSize = 10, leId) {
      assistantApi.queryByPage(pageNum, pageSize, leId).then(res => {
        if (res.msg === 'success') {
          this.pageData.datalist = res.data.records
          this.pageData.pagenum = res.data.pages
          this.pageData.totalelements = res.data.total
        } else {
          this.$message.error('查询失败')
        }
      })
    },
    // 分页按钮点击事件
    handlePageNumChange(val) {
      assistantApi.getLevelByParentId(val, this.pageData.pagesize, 0).then(res => {
        if (res.msg === 'success') {
          this.pageData.datalist = res.data.records
          this.pageData.pagenum = res.data.pages
          this.pageData.totalelements = res.data.total
        } else {
          this.$message.error('查询失败')
        }
      })
    },
    // 创建手册点击方法
    createAssistant() {
      this.$refs['assistantEdit'].handleCreate(this.levelId)
    },
    // 编辑手册点击方法
    updateAssistant(id) {
      this.$refs['assistantEdit'].handleUpdate(id)
    },
    // 根据id删除当前列的数据
    del(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        assistantApi.del(id).then(res => {
          if (res.msg === 'success') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.handquery(this.pageData.pagenum, this.pageData.pagesize, this.levelId)
          } else {
            this.$message.error('删除失败')
          }
        })
      }).catch(() => {
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
.pagination-container {
  text-align: center;
}
</style>
