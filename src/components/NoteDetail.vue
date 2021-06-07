<template>
  <div id="note" class="detail">
    <NoteSideBar @update:notes="val=>notes=val"/>
    <div class="note-detail">
      <div class="note-empty" v-show="!curNote.id">
        请选择笔记
      </div>
      <div class="note-detail-ct" v-show="curNote.id">
        <div class="note-bar">
          <span>创建日期：{{ curNote.createdAtFriendly }}</span>
          <span>更新日期：{{ curNote.updatedAtFriendly }}</span>
          <span>{{ statusText }}</span>
          <span class="iconfont icon-delete" @click="deleteNote"></span>
          <span class="iconfont icon-fullscreen" @click="isShowPreview=!isShowPreview"></span>
        </div>
        <div class="note-title">
          <input type="text" v-model="curNote.title" @input="updateNote" @keydown="statusText='正在输入'"
                 placeholder="输入标题">
        </div>
        <div class="editor">
          <textarea v-show="!isShowPreview" v-model="curNote.content" @keydown="statusText='正在输入'" @input="updateNote"
                    placeholder="输入内容，支持 markdown 语法"></textarea>
          <div class="preview markdown-body" v-html="previewContent" v-show="isShowPreview">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoteSideBar from "@/components/NoteSideBar";
import Auth from '@/apis/auth';
import Bus from '@/helpers/bus';
import _ from 'lodash'
import Notes from '@/apis/note'
import MarkdownIt from 'markdown-it'

let md = new MarkdownIt()

export default {
  components: {NoteSideBar},
  data() {
    return {
      curNote: {},
      notes: [],
      statusText: '笔记未改动',
      isShowPreview: false
    }
  },
  created() {
    Auth.getInfo()
        .then(res => {
          if (!res.isLogin) {
            this.$router.push({path: '/login'})
          }
        })
    Bus.$on('update:curNotes', val => {
      this.curNote = val.find(note => note.id == this.$route.query.noteId) || {}
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.curNote = this.notes.find(note => note.id == to.query.noteId) || {} //this.curNote是一个执行this.notes里的对应那项的指针
    console.log(this.curNote);
    next()
  },
  computed: {
    previewContent() {
      return md.render(this.curNote.content || '')
    }
  },
  methods: {
    updateNote: _.debounce(function () {
      Notes.updateNote({noteId: this.curNote.id}, {title: this.curNote.title, content: this.curNote.content})
          .then(data => {
            this.statusText = '已保存'
            console.log(data);
          }).catch(() => {
        this.statusText = '保存出错'
      })
    }, 300),
    deleteNote() {
      Notes.deleteNote({noteId: this.curNote.id})
          .then(data => {
            this.$message.success(data.msg)
            this.notes.splice(this.notes.indexOf(this.curNote), 1)
            this.$router.replace({path: '/note'})
          })
    }
  }
}
</script>
<style lang="less" scoped>
@import url(../assets/css/note-detail.less);

#note {
  display: flex;
  align-items: stretch;
  background-color: #fff;
  flex: 1;
}
</style>