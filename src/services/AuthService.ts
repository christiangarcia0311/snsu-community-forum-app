import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api/'

export const signupUser = async (username: string, email: string, password: string) => {
    
    try {
        const response = await axios.post(`${API_BASE_URL}signup/`, {
            username,
            email,
            password
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Something went wrong' }
    }
}

export const signinUser = async (username: string, password: string) => {

    try {
        const response = await axios.post(`${API_BASE_URL}signin/`, {
            username,
            password
        })

        const {access, refresh } = response.data

        // store tokens
        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)

        return response.data

    } catch (error: any) {
        throw error.response?.data || { error: 'Something went wrong' }
    }
}

export const logoutUser = async () => {
    try {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
    } catch (error: any) {
        throw error.response?.data || { error: 'Something went wrong' }
    }
}


export const getAuthHeader = () => {
    const token = localStorage.getItem('access_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
}