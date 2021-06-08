import Vue from 'vue'
import Vuex from 'vuex'
import Notebook from '@/apis/notebooks'
import Note from '@/apis/note'
import Auth from '@/apis/auth'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        notebooks: [],
        curBookId: null,
        notes: [],
        curNote: {},
        curNoteId: null,
        user: null
    },
    getters: {
        notebooks: state => state.notebooks || [],
        curBook: state => {
            if (!state.curBookId) return state.notebooks[0] || {}
            return state.notebooks.find(notebook => notebook.id == state.curBookId) || {}
        },
        notes: state => state.notes,
        curNote: state => {
            return state.notes.find(note => note.id == state.curNoteId) || {}
        },
        username: state => state.user === null ? '未登录' : state.user.username,
        slug: state => state.user === null ? '未' : state.user.username[0]
    },
    mutations: {
        setNotebooks(state, payload) {
            state.notebooks = payload.notebooks.reverse()
        },
        addNotebook(state, payload) {
            state.notebooks.unshift(payload.notebook)
        },
        updateNotebook(state, payload) {
            let notebook = state.notebooks.find(notebook => notebook.id == payload.notebookId) || {}
            notebook.title = payload.title
        },
        deleteNotebook(state, payload) {
            state.notebooks = state.notebooks.filter(notebook => notebook.id != payload.notebookId)
        },
        setCurBook(state, payload) {
            state.curBookId = payload.curBookId
        },


        setNote(state, payload) {
            state.notes = payload.notes.reverse()
        },
        addNote(state, payload) {
            state.notes.unshift(payload.note)
        },
        updateNote(state, payload) {
            let note = state.notes.find(note => note.id == payload.noteId) || {}
            note.title = payload.title
            note.content = payload.content
        },
        deleteNote(state, payload) {
            state.notes = state.notes.filter(note => note.id != payload.noteId)
        },
        setCurNote(state, payload) {
            state.curNoteId = payload.curNoteId
        },

        setUser(state, payload) {
            state.user = payload.user
        }
    },
    actions: {
        getNotebooks({commit}) {
            return Notebook.getAll()
                .then(res => {
                    commit('setNotebooks', {notebooks: res.data})
                })
        },
        addNotebook({commit}, payload) {
            return Notebook.addNoteBook({title: payload.title})
                .then(res => {
                    commit('addNotebook', {notebook: res.data})
                })
        },
        updateNotebook({commit}, payload) {
            return Notebook.updateNoteBook(payload.notebookId, {title: payload.title})
                .then(res => {
                    commit('updateNotebook', {notebookId: res.notebookId, title: res.title})
                })
        },
        deleteNotebook({commit}, payload) {
            return Notebook.deleteNoteBook(payload.notebookId)
                .then(() => {
                    commit('deleteNotebook', {notebookId: payload.notebookId})
                })
        },

        getNotes({commit}, payload) {
            return Note.getAll({notebookId: payload.notebookId})
                .then(res => {
                    commit('setNote', {notes: res.data})
                })
        },
        addNote({commit}, payload) {
            return Note.addNote({notebookId: payload.notebookId}, {title: payload.title, content: payload.content})
                .then(res => {
                    commit('addNote', {note: res.data})
                })
        },
        updateNote({commit}, payload) {
            return Note.updateNote({noteId: payload.noteId}, {title: payload.title, content: payload.content})
                .then(res => {
                    commit('updateNote', {noteId: res.noteId, title: res.title, content: payload.content})
                })
        },
        deleteNote({commit}, payload) {
            return Note.deleteNote({noteId: payload.noteId})
                .then(() => {
                    commit('deleteNote', {noteId: payload.noteId})
                })
        },
        login({commit}, {username, password}) {
            return Auth.login({username, password})
                .then(res => {
                    console.log(res);
                    commit('setUser', {user: res.data})
                })
        },
        register({commit}, {username, password}) {
            return Auth.register({username, password})
                .then(res => {
                    console.log(res);
                    commit('setUser', {user: res.data})
                })
        },
        checkLogin({commit}) {
            return Auth.getInfo()
                .then(res => {
                    if (!res.isLogin) {
                        console.log('jump');
                    } else {
                        commit('setUser', {user: res.data})
                    }
                })
        }
    },
    modules: {}
})
