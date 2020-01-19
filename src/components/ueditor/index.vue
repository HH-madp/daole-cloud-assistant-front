<template>
  <div>
    <script :id="id" type="text/plain"/>
  </div>
</template>

<script>
import '@/../static/ueditor/ueditor.config.js'
import '@/../static/ueditor/ueditor.all.min.js'
import '@/../static/ueditor/lang/zh-cn/zh-cn.js'
import random from '@/utils/random'

export default {
  name: 'UEditor',
  props: {
    // 设置初始化内容
    // eslint-disable-next-line vue/require-default-prop
    content: {
      type: String
    },
    // 初始化宽度
    width: {
      type: Number,
      default: null
    },
    // 初始化高度
    height: {
      type: Number,
      default: 200
    },
    // 初始化时是否只读？默认否
    readonly: {
      type: Boolean,
      default: false
    },
    // 工具栏
    toolbars: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      id: 'editor',
      editor: null
    }
  },
  created() {
    this.id = 'editor' + random.randomStr()
  },
  mounted() {
    const config = {
      initialFrameWidth: this.width,
      initialFrameHeight: this.height,
      autoHeightEnabled: false,
      readonly: this.readonly,
      maximumWords: 2000,
      enableAutoSave: true,
      zIndex: 9999
    }
    if (this.toolbars) {
      config.toolbars = this.toolbars
    }
    // 初始化UE
    // eslint-disable-next-line no-undef
    this.editor = UE.getEditor(this.id, config)
    this.editor.addListener('ready', () => {
      // 确保UE加载完成后，放入内容。
      this.editor.setContent(this.content)
    })
  },
  destroyed() {
    this.editor.destory()
  },
  methods: {
    getContent: function() {
      return this.editor.getContent()
    },
    setContent: function(content) {
      const that_ = this
      this.editor.ready(function(editor) {
        that_.editor.setContent(content)
      })
    },
    setDisabled() {
      this.editor.setDisabled()
    },
    setEnabled() {
      this.editor.setEnabled()
    },
    /* 1.用浏览器内部转换器实现html转码*/

    htmlEncode(html) {
      // 1.首先动态创建一个容器标签元素，如DIV

      var temp = document.createElement('div');

      // 2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)

      // eslint-disable-next-line eqeqeq
      (temp.textContent != undefined) ? (temp.textContent = html) : (temp.innerText = html)

      // 3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了

      var output = temp.innerHTML

      temp = null

      return output
    },

    /* 2.用浏览器内部转换器实现html解码*/

    htmlDecode(text) {
      // 1.首先动态创建一个容器标签元素，如DIV

      var temp = document.createElement('div')

      // 2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)

      temp.innerHTML = text

      // 3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。

      var output = temp.innerText || temp.textContent

      temp = null

      return output
    }
  }
}
</script>
