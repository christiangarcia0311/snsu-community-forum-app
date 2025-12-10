import React from 'react'

import {
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonAvatar,
    IonButton,
    IonIcon,
    IonImg,
    IonBadge,
    IonSpinner
} from '@ionic/react'

import {
    heartOutline,
    chatbubbleOutline,
    shareSocialOutline,
    heart
} from 'ionicons/icons'

import photoDefault from '../../assets/images/profile.png'
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

interface ThreadPostListProps {
    threads: ThreadData[]
    loading: boolean
    likingThreads: { [key: number]: boolean }
    onLikeThread: (threadId: number) => void
    onViewThread: (threadId: number) => void
    onViewUserProfile: (userProfile: any) => void
}

const ThreadPostList: React.FC<ThreadPostListProps> = ({
    threads,
    loading,
    likingThreads,
    onLikeThread,
    onViewThread,
    onViewUserProfile
}) => {

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInMs = now.getTime() - date.getTime()
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

        if (diffInMinutes < 1) return 'now'
        if (diffInMinutes < 60) return `${diffInMinutes}${diffInMinutes === 1 ? 'm' : 'ms'} ago`
        if (diffInHours < 24) return `${diffInHours}h ago`
        if (diffInDays < 7) return `${diffInDays}d ago`

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

    if (loading) {
        return (
            <div className="ion-text-center">
                <IonSpinner />
                <p>Loading thread post...</p>
            </div>
        )
    }

    if (threads.length === 0) {
        return (
            <div className="ion-text-center">
                <p>No threads available.</p>
            </div>
        )
    }

    return (
        <div className="home-thread-bottom">
            {threads.map((thread) => {
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
                                                onClick={() => !thread.is_author_admin && onViewUserProfile(thread.author_profile)}
                                            />
                                        </IonAvatar>
                                    </IonCol>
                                    <IonCol>
                                        <IonText
                                            className='thread-profile-click'
                                            onClick={() => !thread.is_author_admin && onViewUserProfile(thread.author_profile)}
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
                                <div onClick={() => onViewThread(thread.id)}>
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
                                                <p className="ion-margin-top home-thread-content">
                                                    {linkifyText(filterContentLength)}
                                                    <small className='home-all-view'>(View full)</small>
                                                </p>
                                            </IonText>
                                        </IonCol>
                                    </IonRow>
                                </div>

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
                                            fill='clear' 
                                            size='small' 
                                            className='home-action-button'
                                            onClick={() => onLikeThread(thread.id)}
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
                                            onClick={() => onViewThread(thread.id)}
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
            })}
        </div>
    )
}

export default ThreadPostList