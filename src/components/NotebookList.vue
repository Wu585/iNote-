<template>
  <div class="detail" id="notebook-list">
    <header>
      <a href="#" class="btn" @click.prevent="onCreate"><i class="iconfont icon-plus"></i>新建笔记本</a>
    </header>
    <main>
      <div class="layout">
        <h3>笔记本列表({{ notebooks.length }})</h3>
        <div class="book-list">
          <router-link v-for="notebook in notebooks" :key="notebook.id" :to="`/note?notebookId=${notebook.id}`" class="notebook">
            <div>
              <span class="iconfont icon-notebook"></span>{{ notebook.title }} <span>{{ notebook.noteCounts }}</span>
              <span class="action" @click.prevent.stop="onEdit(notebook)">编辑</span>
              <span class="action" @click.prevent.stop="onDelete(notebook)">删除</span>
              <span class="date">{{ notebook.friendlyCreatedAt }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
import Auth from '@/apis/auth'
import Notebooks from '@/apis/notebooks'
import {friendlyDate} from "@/helpers/util";

window.Notebooks = Notebooks

export default {
  data() {
    return {
      notebooks: []
    }
  },
  created() {
    Auth.getInfo().then(res => {
      if (!res.isLogin) {
        this.$router.push('/login')
      }
    })
    Notebooks.getAll()
        .then(res => {
          this.notebooks = res.data.reverse()
        })
  },
  methods: {
    onCreate() {
      this.$prompt('请输入笔记本标题', '创建笔记本', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,30}$/,
        inputErrorMessage: '标题不能为空，且不能超过30个字符'
      }).then(({value}) => {
        return Notebooks.addNoteBook({title: value})
      }).then(res => {
        res.data.friendlyCreatedAt = friendlyDate(res.data.createdAt)
        this.notebooks.unshift(res.data)
        this.$message({
          type: 'success',
          message: res.msg
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    onEdit(notebook) {
      let title = ''
      this.$prompt('请输入新笔记本标题', '修改笔记本', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,30}$/,
        inputValue: notebook.title,
        inputErrorMessage: '标题不能为空，且不能超过30个字符'
      }).then(({value}) => {
        title = value
        return Notebooks.updateNoteBook(notebook.id, {title: value})
      }).then(res => {
        notebook.title = title
        this.$message({
          type: 'success',
          message: res.msg
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    onDelete(notebook) {
      this.$confirm('确认要删除笔记吗？', '删除笔记本', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return Notebooks.deleteNoteBook(notebook.id)
      }).then(() => {
        this.notebooks.splice(this.notebooks.indexOf(notebook), 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import url('../assets/css/notebook-list.less');
</style>