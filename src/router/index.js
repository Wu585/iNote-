import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/components/Login";
import NotebookList from '@/components/NotebookList'
import NoteDetail from '@/components/NoteDetail'
import TrashDetail from '@/components/TrashDetail'

Vue.use(VueRouter)

const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err)
}

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/notebooks',
        component: NotebookList
    },
    {
        path: '/note',
        component: NoteDetail
    },
    {
        path: '/trash',
        component: TrashDetail
    }
]

const router = new VueRouter({
    routes
})


export default router
