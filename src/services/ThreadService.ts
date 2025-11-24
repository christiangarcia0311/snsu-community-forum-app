import axios from 'axios'


const API_BASE_URL = 'http://localhost:8000/api/v1/threads/'

const getAuthToken = () => {
    return localStorage.getItem('access_token')
}

interface ThreadPostData {
    id: number
    author: number
    author_username: string
    author_profile: any
    title: string
    content: string 
    image: string | null 
    created_at: string 
    updated_at: string 
}

export const getAllThreadPost = async (): Promise<ThreadPostData[]> => {
    
    try {
        const token = getAuthToken()
        const response = await axios.get(`${API_BASE_URL}posts/`,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        
        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to fetch thread posts' }
    }

}

export const getUserThreadPost = async (): Promise<ThreadPostData[]> => {
    
    try {
        const token = getAuthToken()
        const response = await axios.get(`${API_BASE_URL}my-posts/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to fetch user thread posts' }
    }

}

export const getThreadPostById =  async (id: number): Promise<ThreadPostData[]> => {

    try {
        const response = await axios.get(`${API_BASE_URL}posts/${id}/`)
        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to fetch thread post' }
    }

}

// -- CREATE --
export const createThreadPost = async (
    title: string,
    content: string,
    image?: File
): Promise<any> => {
    
    try {
        const token = getAuthToken()
        const formData =  new FormData()

        formData.append('title', title)
        formData.append('content', content)

        if (image) {
            formData.append('image', image)
        }

        const response =  await axios.post(`${API_BASE_URL}create/`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            },
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to create thread' }
    }

}

// -- UPDATE --
export const updateThreadPost = async (
    id: number,
    title: string,
    content: string,
    image?: File
): Promise<any> => {

    try {
        const token = getAuthToken()
        const formData = new FormData()

        formData.append('title', title)
        formData.append('content', content)

        if (image) {
            formData.append('image', image)
        }

        const response = await axios.put(`${API_BASE_URL}posts/${id}/`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            },
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to update thread post' }
    }

}

// -- DELETE --
export const deleteThreadPost = async (id: number): Promise<any> => {

    try {
        const token = getAuthToken()
        const response = await axios.delete(`${API_BASE_URL}posts/${id}/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to delete thread post' }
    }

}

// COMMENT AND LIKE
export const getThreadComments =  async (threadId: number) => {
    try {
        const token = getAuthToken()
        const response = await axios.get(`${API_BASE_URL}posts/${threadId}/comments/`, {
            headers: { 
                'Authorization': `Bearer ${token}` 
            },
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to fetch comments' }
    }
}

export const createComment = async (threadId: number, content: string) => {
    try {
        const token = getAuthToken()
        const response = await axios.post(`${API_BASE_URL}posts/${threadId}/comments/`, { content, thread: threadId }, {
            headers: { 
                'Authorization': `Bearer ${token}` 
            },
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to create comment' }
    }
}

export const likeThreadPost = async (threadId: number) => {
    try {
        const token = getAuthToken()
        const response = await axios.post(`${API_BASE_URL}posts/${threadId}/like/`, {}, {
            headers: { 
                'Authorization': `Bearer ${token}` 
            },
        })
        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to like thread post' }
    }
}