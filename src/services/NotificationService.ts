import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api/v1/notifications/'

const getAuthToken = () => localStorage.getItem('access_token')
const getAuthHeader = () => ({
    'Authorization': `Bearer ${getAuthToken()}`
})

export interface NotificationData {
    id: number
    sender: {
        username: string
        firstname: string
        lastname: string
        profile_image_url?: string | null
    }
    notification_type: 'like' | 'comment' | 'follow' | 'new_post'
    message: string
    is_read: boolean
    created_at: string
    thread?: {
        id: number
        title: string
    }
}

export interface NotificationResponse {
    notifications: NotificationData[]
    unread_count: number
}

// -- GET ALL NOTIFICATION --
export const getNotifications = async (): Promise<NotificationResponse> => {
    try {
        const response = await axios.get(`${API_BASE_URL}content/`, {
            headers: getAuthHeader()
        })
        
        // Transform backend response to match frontend interface
        const transformedNotifications = response.data.notifications.map((notif: any) => ({
            id: notif.id,
            sender: {
                username: notif.sender_username,
                firstname: notif.sender_first_name || '',
                lastname: notif.sender_last_name || '',
                profile_image_url: notif.sender_profile_image
            },
            notification_type: notif.notification_type,
            message: notif.message,
            is_read: notif.is_read,
            created_at: notif.created_at,
            thread: notif.thread_id ? {
                id: notif.thread_id,
                title: notif.thread_title
            } : undefined
        }))
        
        return {
            notifications: transformedNotifications,
            unread_count: response.data.unread_count
        }
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to fetch notifications' }
    }
}

// -- MARK READ NOTIFICATION --
export const markNotificationAsRead = async (id: number): Promise<NotificationData> => {
    try {
        const response = await axios.patch(`${API_BASE_URL}content/${id}/read/`, {}, {
            headers: getAuthHeader()
        })
        
        // Transform backend response to match frontend interface
        const notif = response.data
        return {
            id: notif.id,
            sender: {
                username: notif.sender_username,
                firstname: notif.sender_first_name || '',
                lastname: notif.sender_last_name || '',
                profile_image_url: notif.sender_profile_image
            },
            notification_type: notif.notification_type,
            message: notif.message,
            is_read: notif.is_read,
            created_at: notif.created_at,
            thread: notif.thread_id ? {
                id: notif.thread_id,
                title: notif.thread_title
            } : undefined
        }
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to mark notification as read' }
    }
}

// -- MARK ALL AS READ NOTIFICATION --
export const markAllNotificationsAsRead = async (): Promise<any> => {
    try {
        const response = await axios.patch(`${API_BASE_URL}content/read-all/`, {}, {
            headers: getAuthHeader()
        })
        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to mark all notifications as read' }
    }
}

// -- DELETE NOTIFICATION --
export const deleteNotification = async (id: number): Promise<any> => {
    try {
        const response = await axios.delete(`${API_BASE_URL}content/${id}/delete`, {
            headers: getAuthHeader()
        })
        return response.data
    } catch (error: any) {
        throw error.response?.data || { error: 'Failed to delete notification' }
    }
}

