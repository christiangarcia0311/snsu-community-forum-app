import React, { useState, useEffect } from 'react'

import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonText,
    IonSpinner,
    IonToast,
    IonBadge,
    IonRefresher,
    IonRefresherContent,
    IonItemSliding,
    IonItemOptions,
    IonItemOption
} from '@ionic/react'

// icons
import {
    arrowForwardOutline,
    checkmarkDoneOutline,
    trashOutline,
    heartOutline,
    chatbubbleOutline,
    personAddOutline,
    documentTextOutline
} from 'ionicons/icons'

// default image
import photoDefault from '../../assets/images/profile.png'

// services
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    NotificationData
} from '../../services/NotificationService'

interface NotificationListProps {
    isOpen: boolean
    onDidDismiss: () => void
    onNotificationClick?: (notification: NotificationData) => void
}

const NotificationList: React.FC<NotificationListProps> = ({
    isOpen,
    onDidDismiss,
    onNotificationClick
}) => {
    const [notifications, setNotifications] = useState<NotificationData[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    useEffect(() => {
        if (isOpen) {
            fetchNotifications()
        }
    }, [isOpen])

    const fetchNotifications = async () => {
        setLoading(true)
        try {
            const data = await getNotifications()
            setNotifications(data.notifications)
            setUnreadCount(data.unread_count)
        } catch (error: any) {
            console.error('Failed to fetch notifications:', error)
            setToastMessage(error.error || 'Failed to load notifications')
            setShowToast(true)
        } finally {
            setLoading(false)
        }
    }

    const handleRefresh = async (event: CustomEvent) => {
        await fetchNotifications()
        event.detail.complete()
    }

    const handleNotificationClick = async (notification: NotificationData) => {
        try {
            if (!notification.is_read) {
                await markNotificationAsRead(notification.id)
                setNotifications(prev =>
                    prev.map(n =>
                        n.id === notification.id ? { ...n, is_read: true } : n
                    )
                )
                setUnreadCount(prev => prev - 1)
            }

            if (onNotificationClick) {
                onNotificationClick(notification)
            }
        } catch (error: any) {
            setToastMessage(error.error || 'Failed to mark as read')
            setShowToast(true)
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead()
            setNotifications(prev =>
                prev.map(n => ({ ...n, is_read: true }))
            )
            setUnreadCount(0)
            setToastMessage('All notifications marked as read')
            setShowToast(true)
        } catch (error: any) {
            setToastMessage(error.error || 'Failed to mark all as read')
            setShowToast(true)
        }
    }

    const handleDeleteNotification = async (id: number) => {
        try {
            await deleteNotification(id)
            setNotifications(prev => prev.filter(n => n.id !== id))
            setToastMessage('Notification deleted')
            setShowToast(true)
        } catch (error: any) {
            setToastMessage(error.error || 'Failed to delete notification')
            setShowToast(true)
        }
    }

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'like':
                return heartOutline
            case 'comment':
                return chatbubbleOutline
            case 'follow':
                return personAddOutline
            case 'new_post':
                return documentTextOutline
            default:
                return documentTextOutline
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInMs = now.getTime() - date.getTime()
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

        if (diffInMinutes < 1) return 'Just now'
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`
        if (diffInHours < 24) return `${diffInHours}h ago`
        if (diffInDays < 7) return `${diffInDays}d ago`

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        })
    }

    return (
        <>
            <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>
                            Notifications
                            {unreadCount > 0 && (
                                <IonBadge color="danger" className="ion-margin-start">
                                    {unreadCount}
                                </IonBadge>
                            )}
                        </IonTitle>
                        <IonButton
                            slot='end'
                            fill='clear'
                            onClick={onDidDismiss}
                        >
                            <IonIcon size='large' icon={arrowForwardOutline} />
                        </IonButton>
                        {unreadCount > 0 && (
                            <IonButton
                                slot='end'
                                fill='clear'
                                onClick={handleMarkAllAsRead}
                            >
                                <IonIcon icon={checkmarkDoneOutline} />
                            </IonButton>
                        )}
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                        <IonRefresherContent
                            pullingText="Pull to refresh"
                            refreshingSpinner="circles"
                            refreshingText="Refreshing..."
                        />
                    </IonRefresher>

                    {loading ? (
                        <div className='ion-text-center ion-padding'>
                            <IonSpinner />
                            <p>Loading notifications...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className='ion-text-center ion-padding'>
                            <IonText>
                                <h4>No notifications yet</h4>
                                <p>When you get notifications, they'll show up here</p>
                            </IonText>
                        </div>
                    ) : (
                        <div>
                            {notifications.map((notification) => {
                                const profilePicture = notification.sender.profile_image_url || photoDefault
                                const senderName = `${notification.sender.firstname} ${notification.sender.lastname}`

                                return (
                                    <IonItemSliding key={notification.id}>
                                        <IonItem
                                            button
                                            lines='none'
                                            onClick={() => handleNotificationClick(notification)}
                                            className={!notification.is_read ? 'notification-unread adjust-background' : ''}
                                        >
                                            <IonAvatar slot='start'>
                                                <img src={profilePicture} alt={senderName} />
                                            </IonAvatar>
                                            <IonLabel>
                                                <small>
                                                    {!notification.is_read && (
                                                        <small className='notification-note ion-text-uppercase ion-margin-end'>
                                                            New
                                                        </small>
                                                    )}
                                                </small>
                                                <p>{notification.message}</p>
                                                <p className="ion-text-wrap">
                                                    <small>{formatDate(notification.created_at)}</small>
                                                </p>
                                            </IonLabel>
                                            <IonIcon
                                                slot='end'
                                                icon={getNotificationIcon(notification.notification_type)}
                                                color={!notification.is_read ? 'primary' : 'medium'}
                                            />
                                        </IonItem>
                                        <IonItemOptions side='end'>
                                            <IonItemOption
                                                color='danger'
                                                onClick={() => handleDeleteNotification(notification.id)}
                                            >
                                                <IonIcon icon={trashOutline} />
                                            </IonItemOption>
                                        </IonItemOptions>
                                    </IonItemSliding>
                                )
                            })}
                        </div>
                    )}
                </IonContent>
            </IonModal>

            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={2000}
                position='top'
            />
        </>
    )
}

export default NotificationList