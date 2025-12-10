import axios from 'axios'

import { API_COMMUNITY_URL } from './api'

const getAuthToken = () => {
    return localStorage.getItem('access_token')
}


// COMMUNITY GROUP
export const getAllCommunityGroup = async () => {
    try {
        const token = getAuthToken()
    const response = await axios.get(`${API_COMMUNITY_URL}groups/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to fetch communities' }
    }
}

export const getUserCommunityGroup = async () => {
    try {
        const token = getAuthToken()
    const response = await axios.get(`${API_COMMUNITY_URL}groups/my-communities/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to fetch user community group' }
    }
}

export const getCommunityGroupById = async (id: number) => {
    try {
        const token = getAuthToken()
    const response = await axios.get(`${API_COMMUNITY_URL}groups/${id}/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to fetch communities' }
    }
}

export const createCommunityGroup = async (
    name: string,
    description: string,
    isPrivate: boolean,
    image?: File
) => {
    try {
        const token = getAuthToken()
        const formData = new FormData()
        
        formData.append('name', name)
        formData.append('description', description)
        formData.append('is_private', isPrivate.toString())
        
        if (image) {
            formData.append('image', image)
        }
        
    const response = await axios.post(`${API_COMMUNITY_URL}groups/create/`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to create community group' }
    }
}

// MEMBERSHIP IN COMMUNITY GROUP
export const joinCommunityGroup = async (communityId: number) => {
    try {
        const token = getAuthToken()
    const response = await axios.post(`${API_COMMUNITY_URL}groups/${communityId}/join/`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to join community group' }
    }
}

export const leaveCommunityGroup = async (communityId: number) => {
    try {
        const token = getAuthToken()
    const response = await axios.delete(`${API_COMMUNITY_URL}groups/${communityId}/join/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to join community group' }
    }
}

export const getCommunityGroupMembers = async (communityId: number) => {
    try {
        const token = getAuthToken()
    const response = await axios.post(`${API_COMMUNITY_URL}groups/${communityId}/members/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to fetch members' }
    }
}

// POSTS IN COMMUNITY GROUP

export const getCommunityGroupPosts = async (communityId: number) => {
    try {
        const token = getAuthToken()
    const response = await axios.get(`${API_COMMUNITY_URL}groups/${communityId}/posts/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to fetch community group posts' }
    }
}

export const createCommunityGroupPost = async (
    communityId: number,
    title: string,
    content: string,
    image?: File
) => {
    try {
        const token = getAuthToken()
        const formData = new FormData()
        
        formData.append('community', communityId.toString())
        formData.append('title', title)
        formData.append('content', content)
        
        if (image) {
            formData.append('image', image)
        }
        
    const response = await axios.post(`${API_COMMUNITY_URL}posts/create/`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to create post' }
    }
}


export const updateCommunityGroupPost = async (
    postId: number,
    title: string,
    content: string,
    image?: File
) => {
    try {
        const token = getAuthToken()
        const formData = new FormData()
        
        formData.append('title', title)
        formData.append('content', content)
        
        if (image) {
            formData.append('image', image)
        }
        
    const response = await axios.put(`${API_COMMUNITY_URL}posts/${postId}/`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to update post' }
    }
}

export const deleteCommunityGroupPost = async (postId: number) => {
    try {
        const token = getAuthToken()
    const response = await axios.delete(`${API_COMMUNITY_URL}posts/${postId}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to delete post' }
    }
}
