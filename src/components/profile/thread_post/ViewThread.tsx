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
    IonBadge,
    IonItem,
    IonLabel,
    IonTextarea,
    IonRefresher,
    IonRefresherContent
} from '@ionic/react'

// icons
import {
    arrowForwardOutline,
    heartOutline,
    chatbubbleOutline,
    shareSocialOutline,
    createOutline,
    trashOutline,
    send,
    heart
} from 'ionicons/icons'

// image default
import photoDefault from '../../../assets/images/profile.png'

// update form
import UpdateThread from './UpdateThread'

// services
import { 
    getThreadPostById, 
    deleteThreadPost,
    getThreadComments,
    createComment,
    likeThreadPost
} from '../../../services/ThreadService'
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
    thread_type: string
    image: string | null
    created_at: string
    updated_at: string
    author: number
    author_username?: string
    author_profile?: any
    likes_count?: number
    comments_count?: number
    is_liked?: boolean
    is_author_admin?: boolean
}

interface CommentData {
    id: number
    thread: number
    author: number
    author_username: string
    author_profile: any
    content: string
    created_at: string
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

    const [comments, setComments] = useState<CommentData[]>([])
    const [newComment, setNewComment] = useState('')
    const [loadingComments, setLoadingComments] = useState(false)
    const [submittingComment, setSubmittingComment] = useState(false)

    const [likingThread, setLikingThread] = useState(false)
    

    useEffect(() => {
        if (isOpen && threadId) {
            fetchUserThreadPost()
            fetchThreadComments()
        }
    }, [isOpen, threadId])

    const handleRefresh = async (event: CustomEvent) => {
        await Promise.all([
            fetchUserThreadPost(),
            fetchThreadComments()
        ])
        event.detail.complete()
    }

    const handleLikeThreadPost = async (threadId: number) => {
        if (likingThread) return

        setLikingThread(true)

        try {
            const response = await likeThreadPost(threadId)
            
            if (thread && thread.id === threadId) {
                setThread({
                    ...thread,
                    likes_count: response.likes_count,
                    is_liked: !thread.is_liked
                })
            }
        } catch (error: any) {
            console.error('Failed to like thread:', error)
        } finally {
            setLikingThread(false)
        }
    }

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

    const fetchThreadComments = async () => {
        if (!threadId) return 

        setLoadingComments(true)

        try {
            const data = await getThreadComments(threadId)
            setComments(data)
        } catch (error: any) {
            setToastMessage(`Failed to load comments ${error}`)
            setShowToast(true)
        } finally {
            setLoadingComments(false)
        }
    }

    const handleSubmitThreadComment = async () => {
        
        // VALIDATION
        if (!threadId || !newComment.trim()) {
            setToastMessage('Please enter a comment')
            setShowToast(true)
            return
        }

        setSubmittingComment(true)
        try {
            await createComment(threadId, newComment.trim())
            setNewComment('')
            setToastMessage('Comment added')
            setShowToast(true)
            
    
            await fetchThreadComments()

        } catch (error: any) {
            console.error('Failed to submit comment:', error)
            setToastMessage(error.error || 'Failed to add comment')
            setShowToast(true)
        } finally {
            setSubmittingComment(false)
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

    const headerName = thread?.author_profile?.firstname || thread?.author_username

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

                    <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                        <IonRefresherContent
                            pullingText="Pull to refresh"
                            refreshingSpinner="circles"
                            refreshingText="Refreshing..."
                        />
                    </IonRefresher>

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
                                                            <h2 className="home-post-name">
                                                                {authorName}
                                                                {
                                                                    thread.is_author_admin ? (
                                                                        <IonBadge className="ion-margin-start profile-admin-badge">Admin</IonBadge>
                                                                    ) : (
                                                                        thread.author_profile?.role && (
                                                                            <IonBadge className="ion-margin-start profile-user-badge">
                                                                                {thread.author_profile.role_display || thread.author_profile.role}
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

                                                {/* CONTENT */}
                                                <IonRow>
                                                    <IonCol>
                                                        <IonText>
                                                            <h2 className="home-thread-title">
                                                                {thread.title}
                                                            </h2>
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
                                                        <IonButton 
                                                            expand='full' 
                                                            fill='clear' 
                                                            size='small' 
                                                            className='home-action-button'
                                                            onClick={() => handleLikeThreadPost(thread.id)}
                                                            disabled={likingThread}          
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
                                                        <IonButton expand='full' fill='clear' size='small' className='home-action-button' disabled>
                                                            <IonIcon icon={chatbubbleOutline} slot='start' />
                                                            <IonText>{comments.length}</IonText>
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
                                                            <h2>Comments ({comments.length})</h2>
                                                        </IonText>
                                                    </IonCol>
                                                </IonRow>

                                                {/* COMMENTS INPUT */}
                                                <IonRow>
                                                    <IonCol>
                                                        <IonItem lines="none" className='adjust-background'>
                                                            <IonTextarea
                                                                placeholder='Write a comment...'
                                                                fill='outline'
                                                                value={newComment}
                                                                onIonInput={(e) => setNewComment(e.detail.value!)}
                                                                rows={1}
                                                                autoGrow={true}
                                                            />
                                                            <IonButton
                                                                slot='end'
                                                                fill='clear'
                                                                onClick={handleSubmitThreadComment}
                                                                disabled={submittingComment || !newComment.trim()}
                                                            >
                                                                {
                                                                    submittingComment ? (
                                                                        <IonSpinner name='dots' />
                                                                    ) : (
                                                                        <IonIcon icon={send} />
                                                                    )
                                                                }
                                                            </IonButton>
                                                        </IonItem>
                                                    </IonCol>
                                                </IonRow>
                                            

                                                {/* COMMENT LIST */}
                                                <IonRow>
                                                    <IonCol>
                                                        {
                                                            loadingComments ? (
                                                                <div className='ion-text-center ion-padding'>
                                                                    <IonSpinner />
                                                                    <p>Loading comments...</p>
                                                                </div>
                                                            ) : comments.length === 0 ? (
                                                                <IonText>
                                                                    <p className='ion-text-center ion-padding'>No comments yet. Be the first to comment!</p>
                                                                </IonText>
                                                            ) : (
                                                               <>
                                                                    {
                                                                        comments.map((comment) => {
                                                                            const commentAuthorPic = comment.author_profile?.profile_image_url || photoDefault
                                                                            const commentAuthorName = comment.author_profile
                                                                                ? `${comment.author_profile.firstname} ${comment.author_profile.lastname}`
                                                                                : comment.author_username

                                                                            return (
                                                                                <IonItem key={comment.id} lines='none' className='adjust-background'>
                                                                                    <IonAvatar slot='start' className='comment-avatar'>
                                                                                        <img src={commentAuthorPic} alt="Profile Picture" />
                                                                                    </IonAvatar>
                                                                                    <IonLabel className='ion-text-wrap'>
                                                                                        <h3>
                                                                                            <strong>{commentAuthorName}</strong>
                                                                                        </h3>
                                                                                        <p className='comment-date'>
                                                                                            <small>{formatDate(comment.created_at)}</small>
                                                                                        </p>
                                                                                        <p className="comment-content">{comment.content}</p>
                                                                                    </IonLabel>
                                                                                </IonItem>
                                                                            )
                                                                        })
                                                                    }
                                                               </>
                                                            )
                                                        }
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
