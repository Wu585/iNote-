import request from "@/helpers/request";
import {friendlyDate} from '@/helpers/util'

const URL = {
    GET: '/notebooks',
    ADD: '/notebooks',
    UPDATE: '/notebooks/:id',
    DELETE: '/notebooks/:id'
}

export default {
    getAll() {
        return new Promise((resolve, reject) => {
            request(URL.GET)
                .then(res => {
                    res.data = res.data.sort((notebook1, notebook2) => notebook1.createdAt > notebook2.createdAt)
                    res.data.forEach(notebook => {
                        notebook.friendlyCreatedAt = friendlyDate(notebook.createdAt)
                    })
                    console.log(res.data);
                    resolve(res)
                }).catch(err => {
                reject(err)
            })
        })
    },
    updateNoteBook(notebookId, {title = ''} = {title: ''}) {
        return request(URL.UPDATE.replace(':id', notebookId), 'PATCH', {title})
    },
    deleteNoteBook(notebookId) {
        return request(URL.DELETE.replace(':id', notebookId), 'DELETE')
    },
    addNoteBook({title = ''} = {title: ''}) {
        return request(URL.ADD, 'POST', {title})
    }
}