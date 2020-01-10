import request from '@/utils/request'
const base_uri = '/assistant/level'

// 获取所有分类
function getLevel() {
  return request.post(base_uri + '/levels')
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
  save
}
