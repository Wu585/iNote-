<template>
  <div id="note" class="detail">
    <NoteSideBar  @update:notes="val=>notes=val"/>
    <div class="note-detail">
      <div class="note-bar">
        <span>创建日期：{{ curNote.createdAtFriendly }}</span>
        <span>更新日期：{{ curNote.updatedAtFriendly }}</span>
        <span>{{ curNote.statusText }}</span>
        <span class="iconfont icon-delete"></span>
        <span class="iconfont icon-fullscreen"></span>
      </div>
      <div class="note-title">
        <input type="text" v-model="curNote.title" placeholder="输入标题">
      </div>
      <div class="editor">
        <textarea v-show="true" :value="curNote.content" placeholder="输入内容，支持 markdown 语法"></textarea>
        <div class="preview markdown-body" v-show="false"></div>
      </div>
    </div>
  </div>
</template>

<script>
import NoteSideBar from "@/components/NoteSideBar";
import Auth from '@/apis/auth'

export default {
  components: {NoteSideBar},
  data() {
    return {
      curNote: {},
      notes: []
    }
  },
  created() {
    Auth.getInfo()
        .then(res => {
          if (!res.isLogin) {
            this.$router.push({path: '/login'})
          }
        })
  },
  beforeRouteUpdate(to, from, next) {
    this.curNote = this.notes.find(note => note.id == to.query.noteId)  //this.curNote是一个执行this.notes里的对应那项的指针
    console.log(this.curNote);
    next()
  }
}
</script>
<style lang="less">
@import url(../assets/css/note-detail.less);

#note {
  display: flex;
  align-items: stretch;
  background-color: #fff;
  flex: 1;
}
</style>