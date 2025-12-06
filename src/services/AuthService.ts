import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1/auth/'

export const signupUser = async (formData: FormData) => {
    
    try {
        const response = await axios.post(`${API_BASE_URL}signup/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        // for debugging
        //console.log('Signup successful:', response.data)
        return response.data

    } catch (error: any) {
        // for debugging
        // console.error('Signup error:', error.response?.data || error)
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

export const updateProfileDetails = async (profileData: {
    username?: string
    firstname?: string
    lastname?: string
    birth_date?: string
    gender?: string
    role?: string
    department?: string
    course?: string
}) => {
    try {
        const response = await axios.patch(
            `${API_BASE_URL}profile/details/`,
            profileData,
            {
                headers: getAuthHeader()
            }
        )

        return response.data
        
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to update profile' }
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

// -- FOLLOW MANAGEMENT -- 
export const followUser = async (username: string) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}follow/${username}/`,
            {},
            {
                headers: getAuthHeader()
            }
        )
        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to follow user' }
    }
}

export const unfollowUser = async (username: string) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}follow/${username}/`,
            {
                headers: getAuthHeader()
            }
        )
        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to unfollow user' }
    }
}

export const getUserFollowers = async (username: string) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}followers/${username}/`,
            {
                headers: getAuthHeader()
            }
        )
        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to fetch followers' }
    }
}

export const getUserFollowing = async (username: string) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}following/${username}/`,
            {
                headers: getAuthHeader()
            }
        )
        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to fetch following' }
    }
}

export const getAllUsers = async () => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}users/`,
            {
                headers: getAuthHeader()
            }
        )
        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to fetch users' }
    }
}