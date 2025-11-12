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

        return response.data

    } catch (error: any) {
        throw error.response?.data || { error: 'Something went wrong' }
    }
}