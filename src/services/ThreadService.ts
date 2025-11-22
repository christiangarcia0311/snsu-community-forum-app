import axios from 'axios'
import { getAuthHeader } from './AuthService'

const API_BASE_URL = 'http://localhost:8000/api/threads/'

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
        const response = await axios.get(`${API_BASE_URL}posts/`)
        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to fetch thread posts' }
    }

}

export const getUserThreadPost = async (): Promise<ThreadPostData[]> => {
    
    try {
        const token = await getAuthHeader()
        const response = await axios.get(`${API_BASE_URL}my-posts/`, {
            headers: {
                'Authorization': `Token ${token}`,
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
        const token = await getAuthHeader()
        const formData =  new FormData()

        formData.append('title', title)
        formData.append('content', content)

        if (image) {
            formData.append('image', image)
        }

        const response =  await axios.post(`${API_BASE_URL}create/`, formData, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'multipart/form-data'
            },
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to create thread' }
    }

}