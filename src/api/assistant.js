import request from '@/utils/request'
const base_uri = '/assistant/level'

// 获取所有分类
function getLevel() {
  return request.post(base_uri + '/levels')
}
//  根据父级id查询该父级id下的所有子级数据
function getLevelByParentId(pageNum, pageSize, parentId) {
  return request.post(base_uri + '/getByParentId', {
    pageNum: pageNum,
    pageSize: pageSize,
    parentId: parentId
  })
}
//  根据id获取数据
function get(id) {
  return request.post(base_uri + '/get', {
    id: id
  })
}
//  根据id删除数据
function del(id) {
  return request.post(base_uri + '/del', {
    id: id
  })
}
/**
 * 保存数据
 */
function save(editFormData) {
  // 格式化上传数据
  const saveParam = Object.assign({}, editFormData)
  // 提交保存
  return request.post(base_uri + '/save', saveParam)
}

// 导出数据结果
export default {
  getLevel,
  save,
  getLevelByParentId,
  get,
  del
}
