import React, { useEffect, useState } from 'react'  
import { useHistory } from 'react-router'

import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonSearchbar,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonAvatar,
    IonCard,
    IonCardContent,
    IonImg,
    IonBadge,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
} from '@ionic/react'


// icons
import {
    notificationsOutline,
    personAddOutline,
    heartOutline,
    chatbubbleOutline,
    shareSocialOutline,
    heart
} from 'ionicons/icons'


// component 
import NotificationList from '../../components/notifications/Notifications'

// image default
import photoDefault from '../../assets/images/profile.png'

// forms
import ViewThread from '../../components/threads/ViewThread'

// addons
import UserProfileSheet from '../../components/addons/ProfileSheet'
import UserProfileView from '../../hooks/UserProfileView'

// services
import { getAllThreadPost, likeThreadPost } from '../../services/ThreadService'
import { getUserProfile } from '../../services/AuthService'
import { getNotifications, NotificationData } from '../../services/NotificationService'

// utilities
import { linkifyText } from '../../utils/linkify'


interface ThreadData {
    id: number 
    title: string
    content: string 
    thread_type: string
    image: string | null 
    created_at: string 
    updated_at: string
    author_username?: string
    author_profile?: any
    likes_count?: number
    comments_count?: number
    is_liked?: boolean
    is_author_admin?: boolean
}

const HomePage = () => {

    const history = useHistory()

    const [threads, setThreads] = useState<ThreadData[]>([])
    const [likingThreads, setLikingThreads] = useState<{ [key: number]: boolean }>({})

    const [loading, setLoading] = useState(true)
    const [showViewModal, setShowViewModal] = useState(false)
    const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null)

    const [showUserProfileSheet, setShowUserProfileSheet] = useState(false)
    const [showUserProfileView, setShowUserProfileView] = useState(false)
    const [selectedUserProfile, setSelectedUserProfile] = useState<any>(null)

    const [showNotifications, setShowNotifications] = useState(false)
    const [notificationCount, setNotificationCount] = useState(0)

    useEffect(() => {
        fetchAllThreadPost()
        fetchNotificationCount()
    }, [])

    const handleRefresh = async (event: CustomEvent) => {
        await fetchAllThreadPost()
        event.detail.complete()
    }

    const handleLikeThreadPost = async (threadId: number) => {
        if (likingThreads[threadId]) return

        setLikingThreads(prev => ({ ...prev, [threadId]: true }))

        try {
            const response = await likeThreadPost(threadId)

            setThreads(prevThreads => 
                prevThreads.map(thread => 
                    thread.id === threadId 
                        ? {
                            ...thread,
                            likes_count: response.likes_count,
                            is_liked: !thread.is_liked
                        }
                        : thread
                )
            )
        } catch (error: any) {
            console.error('Failed to like thread:', error)
        } finally {
            setLikingThreads(prev => ({ ...prev, [threadId]: false }))
        }
    }

    const fetchAllThreadPost = async () => {

        setLoading(true)

        try {
            const data = await getAllThreadPost()
            const shuffledData = [...data].sort(() => Math.random() - 0.5)
            setThreads(shuffledData)
        } catch (error: any) {
            console.log('Failed to fetch thread post')
        } finally {
            setLoading(false)
        }
    }

    const handleViewThreadPost = (threadId: number) => {
        setSelectedThreadId(threadId)
        setShowViewModal(true)
    }

    const handleViewUserProfile = async (userProfile: any) => {
        try {
            const currentUser = await getUserProfile()
            
            if (currentUser.username === userProfile.username) {
                history.push('/tabs/profile')
            } else {
                setSelectedUserProfile(userProfile)
                setShowUserProfileSheet(true)
            }
        } catch (error) {
            console.error('Failed to check user profile:', error)
            
            setSelectedUserProfile(userProfile)
            setShowUserProfileSheet(true)
        }
    }

    const handleViewOtherUserProfile = async (userProfile: any) => {
        try {
            const currentUser = await getUserProfile()
            
            if (currentUser.username === userProfile.username) {
                history.push('/tabs/profile')
            } else {
                setSelectedUserProfile(userProfile)
                setShowUserProfileSheet(false)
            }
        } catch (error) {
            console.error('Failed to check user profile:', error)
            
            setSelectedUserProfile(userProfile)
            setShowUserProfileSheet(false)
        }
    }

    const handleOpenFullProfile = () => {
        setShowUserProfileSheet(false)
        setShowUserProfileView(true)
    }

    const fetchNotificationCount = async () => {
        try {
            const data = await getNotifications()
            setNotificationCount(data.unread_count)
        } catch (error) {
            console.error('Failed to fetch notification count:', error)
        }
    }

    const handleNotificationClick = (notification: NotificationData) => {
        setShowNotifications(false)
        
        if (notification.thread) {
            setSelectedThreadId(notification.thread.id)
            setShowViewModal(true)
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInMs = now.getTime() - date.getTime()
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

        if (diffInMinutes < 1) {
            return 'just now'
        }

        if (diffInMinutes < 60) {
            return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`
        }

        if (diffInHours < 24) {
            return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
        }

        if (diffInDays < 7) {
            return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
        }

        if (diffInDays < 14) {
            const weeks = Math.floor(diffInDays / 7)
            return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
        }

        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }

    return (
        <>
            <IonHeader>
                <IonToolbar className='home-header-bg'>
                    <IonTitle>
                        <h2 className='home-header'>stream</h2>
                    </IonTitle>
                    <IonButton 
                        slot='end' 
                        fill='clear'
                        onClick={() => setShowNotifications(true)}
                    >
                        <IonIcon icon={notificationsOutline} className='home-icon' />
                        {
                            notificationCount > 0 && (
                                <IonBadge color="danger">{notificationCount}</IonBadge>
                            )
                        }
                    </IonButton>
                    <IonButton 
                        slot='end' 
                        fill='clear'
                        onClick={() => history.push('/tabs/all-users')}
                    >
                        <IonIcon icon={personAddOutline} className='home-icon'  />
                    </IonButton>
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

                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonSearchbar
                                className='home-searchbar'
                                placeholder='Search for users, threads or topics...'
                                showClearButton='always'
                            />
                        </IonCol>
                    </IonRow>
                </IonGrid>
                
                {/* THREAD POST */}

                {
                    loading ? (
                        <div className="ion-text-center">
                            <IonSpinner />
                            <p>Loading thread post...</p>
                        </div>
                    ) : threads.length === 0 ? (
                        <div className="ion-text-center">
                            <p>No threads available.</p>
                        </div>
                    ) : (
                        <div className="home-thread-bottom">
                            {    
                                threads.map((thread) => {

                                const profilePicture = thread.author_profile?.profile_image_url || photoDefault
                                const authorName = thread.author_profile 
                                    ? `${thread.author_profile.firstname} ${thread.author_profile.lastname}` 
                                    : thread.author_username || 'Unknown User'

                                const filterContentLength = thread.content.length > 100
                                    ? thread.content.substring(0, 100) + '...' 
                                    : thread.content

                                return (
                                    <IonCard key={thread.id} className='home-thread-post ion-text-left ion-padding'>
                                        <IonCardContent>
                                            <IonGrid>
                                                {/* USER INFO POST */}
                                                <IonRow className='ion-align-items-center'>
                                                    <IonCol size='auto'>
                                                        <IonAvatar className='home-post-avatar'>
                                                            <img 
                                                                src={profilePicture}
                                                                alt="profile" 
                                                                className='home-post-photo thread-profile-click'
                                                                onClick={() => !thread.is_author_admin && handleViewUserProfile(thread.author_profile)}
                                                            />
                                                        </IonAvatar>
                                                    </IonCol>
                                                    <IonCol>
                                                        <IonText
                                                            className='thread-profile-click'
                                                            onClick={() => !thread.is_author_admin && handleViewUserProfile(thread.author_profile)}
                                                        >
                                                            <h2 className="home-post-name">
                                                                {authorName}
                                                                {
                                                                    thread.is_author_admin ? (
                                                                        <IonBadge color="light" className="ion-margin-start profile-admin-badge">Admin</IonBadge>
                                                                    ) : (
                                                                        thread.author_profile?.role && (
                                                                            <IonBadge className="ion-margin-start profile-user-badge">
                                                                                {thread.author_profile.role}
                                                                            </IonBadge>
                                                                        )
                                                                    )
                                                                }
                                                                <IonBadge className='thread-post-badge'>{thread.thread_type}</IonBadge>
                                                            </h2>
                                                        </IonText>
                                                        <IonText>
                                                            <p className="home-post-date">
                                                                <small>{formatDate(thread.created_at)}</small>
                                                            </p>
                                                        </IonText>
                                                    </IonCol>
                                                </IonRow>
                    
                                                {/* CONTENTS */}
                                                <div onClick={() => handleViewThreadPost(thread.id)}>
                                                    <IonRow>
                                                        <IonCol>
                                                            <IonText className='thread-title-click'>
                                                                <h2 className="home-thread-title">
                                                                    {thread.title}
                                                                </h2>
                                                            </IonText>
                                                        </IonCol>
                                                    </IonRow>
                                                    <IonRow>
                                                        <IonCol>
                                                            <IonText>
                                                                <p className="ion-margin-top home-thread-content">{linkifyText(filterContentLength)}<small className='home-all-view'>(View full)</small></p>
                                                            </IonText>
                                                        </IonCol>
                                                    </IonRow>
                                                </div>
                                                
                    
                                                {/* POST WITH IMAGE */}

                                                {thread.image && (
                                                    <IonRow className='ion-margin-top'>
                                                        <IonCol>
                                                            <IonImg 
                                                                src={thread.image}
                                                                alt="Thread post image"
                                                                className='home-thread-image'
                                                            />
                                                        </IonCol>
                                                    </IonRow>
                                                )}
                                                
                    
                                                {/* ACTIONS */}
                                                <IonRow className='ion-margin-top home-thread-actions'>
                                                    <IonCol>
                                                        <IonButton 
                                                            fill='clear' 
                                                            size='small' 
                                                            className='home-action-button'
                                                            onClick={() => handleLikeThreadPost(thread.id)}
                                                            disabled={likingThreads[thread.id]}
                                                        >
                                                            <IonIcon 
                                                                icon={thread.is_liked ? heart : heartOutline} 
                                                                slot='start'
                                                                color={thread.is_liked ? 'danger' : undefined}
                                                            />
                                                            <IonText>{thread.likes_count || 0}</IonText>
                                                        </IonButton>
                                                    </IonCol>
                                                    <IonCol>
                                                        <IonButton 
                                                            fill='clear' 
                                                            size='small' 
                                                            className='home-action-button'
                                                            onClick={() => handleViewThreadPost(thread.id)}
                                                        >
                                                            <IonIcon icon={chatbubbleOutline} slot='start' />
                                                            <IonText>{thread.comments_count || 0}</IonText>
                                                        </IonButton>
                                                    </IonCol>
                                                    <IonCol>
                                                        <IonButton fill='clear' size='small' className='home-action-button'>
                                                            <IonIcon icon={shareSocialOutline} slot='start' />
                                                            <IonText>Share</IonText>
                                                        </IonButton>
                                                    </IonCol>
                                                </IonRow>
                                            </IonGrid>
                                        </IonCardContent>
                                    </IonCard>
                                )
                            })
                        }
                        </div>
                    )
                }
                

            </IonContent>

            <NotificationList
                isOpen={showNotifications}
                onDidDismiss={() => {
                    setShowNotifications(false)
                    fetchNotificationCount()
                }}
                onNotificationClick={handleNotificationClick}
            />

            <ViewThread
                isOpen={showViewModal}
                onDidDismiss={() => {
                    setShowViewModal(false)
                    setSelectedThreadId(null)
                }}
                threadId={selectedThreadId}
                onThreadDeleted={fetchAllThreadPost}
                onThreadUpdated={fetchAllThreadPost}
            />

            <UserProfileSheet
                isOpen={showUserProfileSheet}
                onDidDismiss={() => setShowUserProfileSheet(false)}
                onViewProfile={handleOpenFullProfile}
                userProfile={selectedUserProfile}
            />

            <UserProfileView
                isOpen={showUserProfileView}
                onDidDismiss={() => {
                    setShowUserProfileView(false)
                    setSelectedUserProfile(null)
                }}
                userProfile={selectedUserProfile}
                onViewProfile={handleViewOtherUserProfile}
            />

        </>
    )
}


export default HomePage