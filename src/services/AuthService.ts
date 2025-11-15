import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api/'

export const signupUser = async (formData: FormData) => {
    
    try {
        const response = await axios.post(`${API_BASE_URL}signup/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        console.log('Signup successful:', response.data)
        return response.data

    } catch (error: any) {
        console.error('Signup error:', error.response?.data || error)
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

export const getUserProfile = async () => {
    try {

        const response = await axios.get(`${API_BASE_URL}profile/`, {
            headers: getAuthHeader()
        })

        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to fetch profile' }
    }
}

export const updateProfileImage = async (imageFile: File) => {
    try {
        const formData = new FormData()
        formData.append('profile_image', imageFile)

        const response = await axios.patch(
            `${API_BASE_URL}profile/image/`,
            formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...getAuthHeader()
                }
            }
        )

        return response.data

    } catch (error: any) {
        throw error.response?.data || { error: 'Something went wrong' }
    }
}