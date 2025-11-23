import React, { useState, useEffect } from 'react'

import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonAvatar,
    IonText,
    IonImg,
    IonSpinner,
    IonAlert,
    IonToast,
    IonLoading
} from '@ionic/react'

// icons
import {
    arrowForwardOutline,
    heartOutline,
    chatbubbleOutline,
    shareSocialOutline,
    createOutline,
    trashOutline
} from 'ionicons/icons'

// image default
import photoDefault from '../../../assets/images/profile.png'

// update form
import UpdateThread from './UpdateThread'

// services
import { getThreadPostById, deleteThreadPost } from '../../../services/ThreadService'
import { getUserProfile } from '../../../services/AuthService'

interface ViewThreadProps {
    isOpen: boolean
    onDidDismiss: () => void
    threadId: number | null
    onThreadDeleted?: () => void
    onThreadUpdated?: () => void
}

interface ThreadData {
    id: number
    title: string
    content: string
    image: string | null
    created_at: string
    updated_at: string
    author: number
    author_username?: string
    author_profile?: any
}

const ViewThread: React.FC<ViewThreadProps> = ({
    isOpen,
    onDidDismiss,
    threadId,
    onThreadDeleted,
    onThreadUpdated
}) => {
    const [thread, setThread] = useState<ThreadData | null>(null)
    const [loading, setLoading] = useState(true)
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [isOwner, setIsOwner] = useState(false)

    useEffect(() => {
        if (isOpen && threadId) {
            fetchUserThreadPost()
        }
    }, [isOpen, threadId])

    const fetchUserThreadPost = async () => {
        
        if (!threadId) return 

        setLoading(true)

        try {
            const data: any = await getThreadPostById(threadId)
            setThread(data)

            try {
                const profile: any = await getUserProfile()
                setIsOwner(!!(data.author_username && profile?.username && data.author_username === profile.username))
            } catch (error) {
                setIsOwner(false)
            }

        } catch (error) {
            console.error(`Failed to fetch user thread post ${error}`)
            setToastMessage('Failed to load thread post')
            setShowToast(true)
        } finally {
            setLoading(false)
        }

    }

    const handleDeleteThreadPost = async () => {
        if (!threadId) return 

        try {
            await deleteThreadPost(threadId)
            setToastMessage('Thread post successfully deleted')
            setShowToast(true)

            setTimeout(() => {
                if (onThreadDeleted) {
                    onThreadDeleted()
                }
                onDidDismiss()
            }, 2000)
        } catch (error: any) {
            console.error(`Failed to delete thread ${error}`)
            setToastMessage('Failed to delete thread post')
            setShowToast(true)
        }
    }

    const handleUpdateThreadPost = () => {
        setShowUpdateModal(true)
    }

    const handleThreadPostUpdated = () => {
        fetchUserThreadPost()
        if (onThreadUpdated) {
            onThreadUpdated()
        }
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


    const profilePicture = thread?.author_profile?.profile_image_url || photoDefault
    const authorName = thread?.author_profile
        ? `${thread.author_profile.firstname} ${thread.author_profile.lastname}`
        : thread?.author_username || 'Unknown User'

    const headerName = thread?.author_profile.firstname

    return (
        <>
            <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>

                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{headerName}'s post</IonTitle>
                        <IonButton
                            slot='end'
                            fill='clear'
                            onClick={onDidDismiss}
                        >
                            <IonIcon size='large' icon={arrowForwardOutline} />
                        </IonButton>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    {
                        loading ? (
                            <div className='ion-text-center'>
                                <IonSpinner />
                                <p>Loading thread post...</p>
                            </div>
                        ) : thread ? (
                            <div>
                                <IonGrid>
                                    <IonCard className='home-thread-post'>
                                        <IonCardContent>
                                            
                                            <IonGrid>
                                                
                                                {/* USER OWNER PRIVILEGE */}
                                                {
                                                    isOwner && (
                                                        <IonRow>
                                                            <IonCol>
                                                                <IonButton
                                                                    
                                                                    fill='clear'
                                                                    onClick={handleUpdateThreadPost}
                                                                >
                                                                    <IonIcon icon={createOutline} slot='start' />
                                                                </IonButton>
                                                                <IonButton
                                                                    
                                                                    fill='clear'
                                                                    color='danger'
                                                                    onClick={() => setShowDeleteAlert(true)}
                                                                >
                                                                    <IonIcon icon={trashOutline} slot='start' />
                                                                </IonButton>
                                                            </IonCol>
                                                            
                                                        </IonRow>
                                                    )
                                                }
                                                
                                                {/* USER INFO */}
                                                <IonRow>
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
                                                            <h2 className="home-post-name">{authorName}</h2>
                                                        </IonText>
                                                        <IonText>
                                                            <p className="home-post-date">
                                                                <small>{formatDate(thread.created_at)}</small>
                                                            </p>
                                                        </IonText>
                                                    </IonCol>
                                                </IonRow>

                                                {/* CONTENT */}
                                                <IonRow>
                                                    <IonCol>
                                                        <IonText>
                                                            <h2 className="home-thread-title">{thread.title}</h2>
                                                        </IonText>
                                                    </IonCol>
                                                </IonRow>
                                                <IonRow>
                                                    <IonCol>
                                                        <IonText>
                                                            <p className="ion-margin-top home-thread-content">{thread.content}</p>
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
                                                <IonRow className='ion-margin-top home-thread-actions ion-text-center'>
                                                    <IonCol>
                                                        <IonButton expand='full' fill='clear' size='small' className='home-action-button'>
                                                            <IonIcon icon={heartOutline} slot='start' />
                                                            <IonText>24</IonText>
                                                        </IonButton>
                                                    </IonCol>
                                                    <IonCol>
                                                        <IonButton expand='full' fill='clear' size='small' className='home-action-button'>
                                                            <IonIcon icon={chatbubbleOutline} slot='start' />
                                                            <IonText>12</IonText>
                                                        </IonButton>
                                                    </IonCol>
                                                    <IonCol>
                                                        <IonButton expand='full' fill='clear' size='small' className='home-action-button'>
                                                            <IonIcon icon={shareSocialOutline} slot='start' />
                                                            <IonText>Share</IonText>
                                                        </IonButton>
                                                    </IonCol>
                                                </IonRow>

                                                {/* COMMENTS SECTION */}
                                                <IonRow className='ion-margin-top'>
                                                    <IonCol>
                                                        <IonText>
                                                            <h2>Comments</h2>
                                                        </IonText>
                                                        <IonText>
                                                            <p className='ion-text-center ion-padding'>No comments yet. Be the first to comment!</p>
                                                        </IonText>
                                                    </IonCol>
                                                </IonRow>

                                            </IonGrid>

                                        </IonCardContent>
                                    </IonCard>
                                </IonGrid>
                            </div>
                        ) : (
                            <div className='ion-text-center ion-padding'>
                                <p>Thread not found</p>
                            </div>
                        )
                    }
                </IonContent>
            </IonModal>

            {/* NOTIFICATIONS AND ALERT */}
            <IonAlert
                isOpen={showDeleteAlert}
                onDidDismiss={() => setShowDeleteAlert(false)}
                header='Delete thread post'
                message='Are you sure you want to delete this thread post? This action cannot be undone.'
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel'
                    },
                    {
                        text: 'Delete',
                        role: 'destructive',
                        handler: handleDeleteThreadPost
                    }
                ]}
            />

            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={2000}
                position='bottom'
            />

            <UpdateThread
                isOpen={showUpdateModal}
                onDidDismiss={() => setShowUpdateModal(false)}
                threadId={threadId}
                onThreadUpdated={handleThreadPostUpdated}
            />

        </>
    )

}

export default ViewThread
