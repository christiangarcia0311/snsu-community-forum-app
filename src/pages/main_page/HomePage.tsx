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
    IonChip,
    IonAvatar,
    IonCard,
    IonCardContent,
    IonImg,
    IonBadge,
    IonSpinner,
    IonRefresher,
    IonRefresherContent
} from '@ionic/react'


// icons
import {
    notificationsOutline,
    personAddOutline,
    heartOutline,
    chatbubbleOutline,
    shareSocialOutline
} from 'ionicons/icons'

// image default
import photoDefault from '../../assets/images/profile.png'

// forms
import ViewThread from '../../components/profile/thread_post/ViewThread'

// addons
import UserProfileSheet from '../../components/addons/ProfileSheet'
import UserProfileView from '../../hooks/UserProfileView'

// services
import { getAllThreadPost } from '../../services/ThreadService'
import { getUserProfile } from '../../services/AuthService'

interface ThreadData {
    id: number 
    title: string
    content: string 
    image: string | null 
    created_at: string 
    updated_at: string
    author_username?: string
    author_profile?: any
}

const HomePage = () => {

    const history = useHistory()

    const [threads, setThreads] = useState<ThreadData[]>([])
    const [loading, setLoading] = useState(true)
    const [showViewModal, setShowViewModal] = useState(false)
    const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null)

    const [showUserProfileSheet, setShowUserProfileSheet] = useState(false)
    const [showUserProfileView, setShowUserProfileView] = useState(false)
    const [selectedUserProfile, setSelectedUserProfile] = useState<any>(null)

    useEffect(() => {
        fetchAllThreadPost()
    }, [])

    const handleRefresh = async (event: CustomEvent) => {
        await fetchAllThreadPost()
        event.detail.complete()
    }

    const fetchAllThreadPost = async () => {

        setLoading(true)

        try {
            const data = await getAllThreadPost()
            setThreads(data)
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

    const handleOpenFullProfile = () => {
        setShowUserProfileSheet(false)
        setShowUserProfileView(true)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInMs = now.getTime() - date.getTime()
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

        // Just now (less than 1 minute)
        if (diffInMinutes < 1) {
            return 'just now'
        }

        // Minutes ago (1-59 minutes)
        if (diffInMinutes < 60) {
            return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`
        }

        // Hours ago (1-23 hours)
        if (diffInHours < 24) {
            return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
        }

        // Days ago (1-6 days)
        if (diffInDays < 7) {
            return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
        }

        // Weeks ago (7-13 days)
        if (diffInDays < 14) {
            const weeks = Math.floor(diffInDays / 7)
            return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
        }

        // Full date format (14+ days)
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
                    <IonButton slot='end' fill='clear'>
                        <IonIcon icon={notificationsOutline} className='home-icon' />
                        <IonBadge color="danger" shape='round'>7</IonBadge>
                    </IonButton>
                    <IonButton slot='end' fill='clear'>
                        <IonIcon icon={personAddOutline} className='home-icon'  />
                    </IonButton>
                </IonToolbar>
            </IonHeader>

            <IonContent>

                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent
                        pullingIcon="chevron-down-circle-outline"
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
                    <IonRow>
                        <IonCol className='ion-text-center'>
                            <IonChip className='home-chip'>All</IonChip>
                            <IonChip className='home-chip'>Discussions</IonChip>
                            <IonChip className='home-chip'>Questions</IonChip>
                            <IonChip className='home-chip'>Guide</IonChip>
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
                                                            onClick={() => handleViewUserProfile(thread.author_profile)}
                                                        />
                                                    </IonAvatar>
                                                </IonCol>
                                                <IonCol>
                                                    <IonText
                                                        className='thread-profile-click'
                                                        onClick={() => handleViewUserProfile(thread.author_profile)}
                                                    >
                                                        <h2 className="home-post-name">{authorName}</h2>
                                                    </IonText>
                                                    <IonText>
                                                        <p className="home-post-date">
                                                            <small>{formatDate(thread.created_at)}</small>
                                                        </p>
                                                    </IonText>
                                                </IonCol>
                                            </IonRow>
                
                                            {/* CONTENTS */}
                                            <IonRow>
                                                <IonCol>
                                                    <IonText
                                                        onClick={() => handleViewThreadPost(thread.id)}
                                                        className='thread-title-click'
                                                    >
                                                        <h2 className="home-thread-title">{thread.title}</h2>
                                                    </IonText>
                                                </IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol>
                                                    <IonText>
                                                        <p className="ion-margin-top home-thread-content">{filterContentLength}</p>
                                                    </IonText>
                                                </IonCol>
                                            </IonRow>
                
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
                                                    <IonButton fill='clear' size='small' className='home-action-button'>
                                                        <IonIcon icon={heartOutline} slot='start' />
                                                        <IonText>24</IonText>
                                                    </IonButton>
                                                </IonCol>
                                                <IonCol>
                                                    <IonButton fill='clear' size='small' className='home-action-button'>
                                                        <IonIcon icon={chatbubbleOutline} slot='start' />
                                                        <IonText>12</IonText>
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
                    )
                }
                

            </IonContent>


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
            />

        </>
    )
}


export default HomePage