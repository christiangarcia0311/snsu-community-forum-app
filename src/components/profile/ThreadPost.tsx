import React , { useEffect, useState } from 'react'

import {
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonText,
    IonIcon,
    IonSpinner,
    IonImg,
    IonAvatar,
    IonBadge
} from '@ionic/react'

// icons
import { 
    addCircleOutline,
    heartOutline,
    chatbubbleOutline,
    shareSocialOutline,
    heart
} from 'ionicons/icons'

// image default
import photoDefault from '../../assets/images/profile.png'

// services 
import { getUserThreadPost } from '../../services/ThreadService'
import { likeThreadPost } from '../../services/ThreadService'

// thread form 
import CreateThread from './thread_post/CreateThread'
import ViewThread from './thread_post/ViewThread'

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
}

const ThreadPost: React.FC = () => {

    const [threads, setThreads] = useState<ThreadData[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null)
    const [likingThreads, setLikingThreads] = useState<{ [key: number]: boolean }>({})

    useEffect(() => {
        fetchUserThreadPost()
    }, [])

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

    const fetchUserThreadPost = async () => {

        setLoading(true)

        try {
            const data = await getUserThreadPost()
            setThreads(data)
        } catch (error) {
            console.error(`Failed to fetch user thread post ${error}`)
        } finally {
            setLoading(false)
        }

    }

    const handleViewThreadPost = (threadId: number) => {
        setSelectedThreadId(threadId)
        setShowViewModal(true)
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

    if (loading) {
        return (
            <div className='ion-text-center ion-padding'>
                <IonSpinner />
            </div>
        )
    }

    if (threads.length === 0) {
        return (
            <>
                <div className="profile-thread-center ion-text-center ion-padding">
                    <div>
                        <IonIcon 
                            icon={addCircleOutline} 
                            className='profile-thread-icon'
                        />
                        
                        <IonText>
                            <h2 className='profile-thread-header'>No Threads Yet</h2>
                        </IonText>
                        
                        <IonText>
                            <p className='profile-thread-sub'>
                                Start sharing your thoughts with the community. 
                                Create your first thread post now!
                            </p>
                        </IonText>

                        <IonButton
                            color='secondary'
                            fill='outline'
                            className='ion-margin-top'
                            onClick={() => setShowCreateModal(true)}
                        >
                            Create First Thread
                        </IonButton>
                    </div>
                </div>

                <CreateThread
                    isOpen={showCreateModal}
                    onDidDismiss={() => setShowCreateModal(false)}
                    onThreadCreated={fetchUserThreadPost}
                />
            </>
        )
    }

    return (
        <>
            <div>
                <IonButton
                    expand='block'
                    fill='outline'
                    className='ion-margin-top'
                    onClick={() => setShowCreateModal(true)}
                >
                    New Thread
                </IonButton>

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
                            <IonCard key={thread.id} className='home-thread-post'>
                                <IonCardContent>
                                    <IonGrid>
                                        {/* USER INFO POST */}
                                        <IonRow className='ion-align-items-center'>
                                            <IonCol size='auto'>
                                                <IonAvatar className='home-post-avatar'>
                                                    <img 
                                                        src={profilePicture}
                                                        alt="profile" 
                                                        className='home-post-photo'
                                                    />
                                                </IonAvatar>
                                            </IonCol>
                                            <IonCol>
                                                <IonText>
                                                    <h2 className="home-post-name">
                                                        {authorName}
                                                        {
                                                            thread.author_profile?.role && (
                                                                <IonBadge className="ion-margin-start profile-user-badge">
                                                                    {thread.author_profile.role}
                                                                </IonBadge>
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
                                                        <h2 className="home-thread-title">{thread.title}</h2>
                                                    </IonText>
                                                </IonCol>
                                            </IonRow>
                                            <IonRow>
                                                <IonCol>
                                                    <IonText>
                                                        <p className="ion-margin-top home-thread-content">{filterContentLength}<small className='home-all-view'>(View full)</small></p>
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
                                                        color={thread.is_liked ? 'danger' : 'dark'}
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

            <CreateThread
                isOpen={showCreateModal}
                onDidDismiss={() => setShowCreateModal(false)}
                onThreadCreated={fetchUserThreadPost}
            />

            <ViewThread
                isOpen={showViewModal}
                onDidDismiss={() => {
                    setShowViewModal(false)
                    setSelectedThreadId(null)
                }}
                threadId={selectedThreadId}
                onThreadDeleted={fetchUserThreadPost}
                onThreadUpdated={fetchUserThreadPost}
            />

        </>
    )

    
}

export default ThreadPost