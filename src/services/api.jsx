import axios from "axios";

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:3000/blog/v1',
    timeout: 5000
})

export const postComment = async (data) => {
    try {
        return await apiClient.post('/comments/postComment', data)
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getcomments = async () => {
    try {
        return await apiClient.get('/comments/getComments')
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getCommentByPublication = async (title) => {
    try {
        return await apiClient.get(`/comments/getCommentByPublication/${title}`)
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const putComment = async (id, data) => {
    try {
        return await apiClient.put(`/comments/putComment/${id}`, data);
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const deleteComment = async (id) => {
    try {
        return await apiClient.delete(`/comments/deleteComment/${id}`)
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getPublications = async () => {
    try {
        return await apiClient.get('/publications/getPublications')
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const getPublicationsByCourseName = async (name) => {
    try {
        return await apiClient.get(`/publications/getPublicationsByCourseName/${name}`)
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}