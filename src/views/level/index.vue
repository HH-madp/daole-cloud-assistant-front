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
        <el-button type="primary" size="mini" @click="getlevel">查询一级菜单</el-button>
        <el-button type="primary" size="mini" @click="openLevelDialog">创建一级菜单</el-button>
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
          :formatter="stateFormat"
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
          <el-button @click="dialogChileFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleChildSave">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import levelApi from '@/api/level'

export default {
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
      form: {
        name: '',
        parentId: 0
      },
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
    // 重只表单数据
    this.resetEditFormData()
    // 左侧树结构获取所有树数据
    this.getLevels()
    // 右侧表格，初始化页面后默认获取一级菜单数据
    this.getLevelsByParentId(this.pageData.pagenum, this.pageData.pagesize, this.parentId)
  },
  methods: {
    // 重置表单数据
    resetEditFormData() {
      this.form = {
        name: '',
        parentId: 0
      }
    },
    // 树的过滤
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 树的点击事件
    treeCheck(data) {
      // 删除成功后，按当前树的节点查询节点下的分类
      this.parentId = data.id
      // 选择单选框创建子集菜单时，form表单的parentId为当前选择项的id
      this.form.parentId = data.id
      // 选择单选框,查询改菜单下的子集菜单，查询方法中的parentId为当前选择项的id
      this.getLevelsByParentId(this.pageData.pagenum, this.pageData.pagesize, data.id)
    },
    // 获取所有节点信息
    getLevels() {
      levelApi.getLevel().then(res => {
        if (res.msg === 'success') {
          this.treeData = res.data
        }
      })
    },
    // 根据父节点id获取该节点下的菜单数据
    getLevelsByParentId(pageNum, pageSize, parentId) {
      levelApi.getLevelByParentId(pageNum, pageSize, parentId).then(res => {
        if (res.msg === 'success') {
          this.pageData.datalist = res.data.records
          this.pageData.pagenum = res.data.current
          this.pageData.totalelements = res.data.total
        } else {
          this.$message.error('查询失败')
        }
      })
    },
    // 查询一级菜单按钮点击事件
    getlevel() {
      levelApi.getLevelByParentId(0, 10, 0).then(res => {
        if (res.msg === 'success') {
          this.pageData.datalist = res.data.records
          this.pageData.pagenum = res.data.current
          this.pageData.totalelements = res.data.total
        } else {
          this.$message.error('查询失败')
        }
      })
    },
    // 分页按钮点击事件
    handlePageNumChange(val) {
      levelApi.getLevelByParentId(val, this.pageData.pagesize, 0).then(res => {
        if (res.msg === 'success') {
          this.pageData.datalist = res.data.records
          this.pageData.pagenum = res.data.pages
          this.pageData.totalelements = res.data.total
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
      levelApi.save(this.form).then(res => {
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
    // 创建子级菜单弹出框
    createChildLevel(id) {
      this.dialogChileFormVisible = true
      this.form.parentId = id
    },
    // 子级菜单保存数据
    handleChildSave() {
      levelApi.save(this.form).then(res => {
        if (res.msg === 'success') {
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 2000
          })
          this.dialogChileFormVisible = false
          // 重置表单数据
          this.resetEditFormData()
          // 通过判断this.form.id是否有值判断是新增操作还是编辑操作
          if (this.form.id === 'undefind') {
            // 新增操作
            // 将新增加的子级拼接到左侧树中
            this.$refs.tree.append(res.data, this.parentId)
            // 重新拉取右侧表格数据
            this.getLevelsByParentId(0, this.pageData.pagesize, this.parentId)
          } else {
            // 编辑操作
            // 获取左侧树数据
            this.getLevels()
            // 重新拉取右侧表格数据
            this.getLevelsByParentId(this.pageData.pagenum, this.pageData.pagesize, this.parentId)
          }
        } else {
          this.$message.error('创建失败')
        }
      })
    },
    // 根据id获取当前列的数据
    get(id) {
      levelApi.get(id).then(res => {
        if (res.msg === 'success') {
          if (res.data.length > 0) {
            this.form = res.data[0]
            this.dialogChileFormVisible = true
          }
        } else {
          this.$message.error('查询失败')
        }
      })
    },
    // 根据id删除当前列的数据
    del(id) {
      this.$confirm('此操作将删除该分类下的所有手册, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        levelApi.del(id).then(res => {
          if (res.msg === 'success') {
            this.$refs.tree.remove(id)
            // 重新拉取右侧表格数据
            this.getLevelsByParentId(this.pageData.pagenum, this.pageData.pagesize, this.parentId)
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$message.error(res.msg)
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
