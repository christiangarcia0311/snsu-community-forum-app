import React, { useEffect, useState } from 'react'  
import { useHistory } from 'react-router-dom'

import {
    IonPage,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonBadge,
    IonRefresher,
    IonRefresherContent
} from '@ionic/react'

import {
    notificationsOutline,
    personAddOutline,
    searchOutline,
    addOutline
} from 'ionicons/icons'

import UserProfileView from '../../hooks/UserProfileView'

import ViewThread from '../../components/threads/ViewThread'
import CreateThread from '../../components/threads/CreateThread'
import NotificationList from '../../components/home/NotificationList'
import UserProfileSheet from '../../components/addons/ProfileSheet'
import ThreadPostList from '../../components/home/ThreadPostList'
import UsersList from '../../components/home/UsersList'
import SearchList from '../../components/home/SearchList'

import { getAllThreadPost, likeThreadPost } from '../../services/ThreadService'
import { getUserProfile } from '../../services/AuthService'
import { getNotifications, NotificationData } from '../../services/NotificationService'


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
    const [showUsersList, setShowUsersList] = useState(false)
    const [notificationCount, setNotificationCount] = useState(0)

    const [showSearchModal, setShowSearchModal] = useState(false)
    const [showCreateThread, setShowCreateThread] = useState(false)

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

    return (
        <>
            <IonPage>
                <IonHeader>
                    <IonToolbar className='home-header-bg'>
                        <IonTitle>
                            <h2 className='home-header'>stream</h2>
                        </IonTitle>
                        <IonButton
                            slot='end'
                            fill='clear'
                            onClick={() => setShowCreateThread(true)}
                        >
                            <IonIcon icon={addOutline} className='home-icon' />
                        </IonButton>
                        <IonButton
                            slot='end'
                            fill='clear'
                            onClick={() => setShowSearchModal(true)}
                        >
                            <IonIcon icon={searchOutline} className='home-icon' />
                        </IonButton>
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
                            onClick={() => setShowUsersList(true)}
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
                    
                    <ThreadPostList
                        threads={threads}
                        loading={loading}
                        likingThreads={likingThreads}
                        onLikeThread={handleLikeThreadPost}
                        onViewThread={handleViewThreadPost}
                        onViewUserProfile={handleViewUserProfile}
                    />
                </IonContent>
            </IonPage>

            <SearchList
                isOpen={showSearchModal}
                onDidDismiss={() => setShowSearchModal(false)}
                onViewUserProfile={handleViewUserProfile}
                onViewThread={handleViewThreadPost}
            />

            <NotificationList
                isOpen={showNotifications}
                onDidDismiss={() => {
                    setShowNotifications(false)
                    fetchNotificationCount()
                }}
                onNotificationClick={handleNotificationClick}
            />

            <UsersList
                isOpen={showUsersList}
                onDidDismiss={() => setShowUsersList(false)}
                onNavigateToProfile={() => history.push('/tabs/profile')}
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

            <CreateThread
                isOpen={showCreateThread}
                onDidDismiss={() => setShowCreateThread(false)}
                onThreadCreated={fetchAllThreadPost}
            />
        </>
    )
}

export default HomePage