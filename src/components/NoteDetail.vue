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
          <span class="iconfont icon-delete" @click="onDeleteNote"></span>
          <span class="iconfont icon-fullscreen" @click="isShowPreview=!isShowPreview"></span>
        </div>
        <div class="note-title">
          <input type="text" v-model="curNote.title" @input="onUpdateNote" @keydown="statusText='正在输入'"
                 placeholder="输入标题">
        </div>
        <div class="editor">
          <textarea v-show="!isShowPreview" v-model="curNote.content" @keydown="statusText='正在输入'" @input="onUpdateNote"
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
import _ from 'lodash'
import MarkdownIt from 'markdown-it'
import {mapGetters, mapMutations, mapActions} from 'vuex'

let md = new MarkdownIt()

export default {
  components: {NoteSideBar},
  data() {
    return {
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

  },
  beforeRouteUpdate(to, from, next) {
    this.setCurNote({curNoteId: to.query.noteId})
    next()
  },
  computed: {
    ...mapGetters([
      'notes',
      'curNote'
    ]),
    previewContent() {
      return md.render(this.curNote.content || '')
    }
  },
  methods: {
    ...mapMutations([
      'setCurNote'
    ]),
    ...mapActions([
          'updateNote',
          'deleteNote'
        ]
    ),
    onUpdateNote: _.debounce(function () {
      this.updateNote({noteId: this.curNote.id, title: this.curNote.title, content: this.curNote.content})
          .then(() => {
            this.statusText = '已保存'
          }).catch(() => {
        this.statusText = '保存出错'
      })
    }, 300),
    onDeleteNote() {
      this.deleteNote({noteId: this.curNote.id})
          .then(() => {
            this.$router.replace({path: `/note?notebookId=${this.$store.state.curBookId}`})
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