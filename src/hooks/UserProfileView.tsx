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
    IonAvatar,
    IonText,
    IonItem,
    IonLabel,
    IonSpinner,
    IonSegment,
    IonSegmentButton,
    IonCard,
    IonCardContent,
    IonImg,
    IonToast
} from '@ionic/react'

// icons
import {
    arrowForwardOutline,
    heartOutline,
    chatbubbleOutline,
    shareSocialOutline,
    personAddOutline,
    checkmarkCircleOutline
} from 'ionicons/icons'

// default image
import photoDefault from '../assets/images/profile.png'

// follow user
import UserFollowers from './UserFollowers'
import UserFollowing from './UserFollowing'

// services
import { getAllThreadPost } from '../services/ThreadService'
import { followUser, unfollowUser } from '../services/AuthService'

// components
import ViewThread from '../components/profile/thread_post/ViewThread'

interface UserProfileViewProps {
    isOpen: boolean
    onDidDismiss: () => void
    userProfile: {
        username: string
        firstname: string
        lastname: string
        email: string
        role: string
        role_display: string
        department: string
        department_display: string
        course: string
        course_display: string
        gender_display?: string
        birth_date?: string
        profile_image_url?: string | null
        created_at?: string
        followers_count?: number
        following_count?: number
        is_following?: boolean
    } | null
}

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

const UserProfileView: React.FC<UserProfileViewProps> = ({
    isOpen,
    onDidDismiss,
    userProfile
}) => {

    const [selectedSegment, setSelectedSegment] = useState<string>('threads')
    const [threads, setThreads] = useState<ThreadData[]>([])
    const [loading, setLoading] = useState(false)
    const [followersCount, setFollowersCount] = useState(0)
    const [isFollowing, setIsFollowing] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [showViewModal, setShowViewModal] = useState(false)
    const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null)
    const [followLoading, setFollowLoading] = useState(false)

    const [showFollowersModal, setShowFollowersModal] = useState(false)
    const [showFollowingModal, setShowFollowingModal] = useState(false)

    useEffect(() => {
        if (isOpen && userProfile) {
            fetchUserThreads()
            setIsFollowing(userProfile.is_following || false)
            setFollowersCount(userProfile.followers_count || 0)
        }
    }, [isOpen, userProfile])

    const fetchUserThreads = async () => {
        if (!userProfile) return

        setLoading(true)
        try {
            const allThreads = await getAllThreadPost()

            // Filter threads by this user's username
            const userThreads = allThreads.filter(
                thread => thread.author_username === userProfile.username
            )
            setThreads(userThreads)
        } catch (error) {
            console.error('Failed to fetch user threads:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFollow = async () => {
        if (!userProfile || followLoading) return
        
        setFollowLoading(true)
        try {
            if (isFollowing) {
                const response = await unfollowUser(userProfile.username)
                setIsFollowing(false)
                setFollowersCount(response.followers_count)
                setToastMessage(`Unfollowed ${userProfile.firstname}`)
            } else {
                const response = await followUser(userProfile.username)
                setIsFollowing(true)
                setFollowersCount(response.followers_count)
                setToastMessage(`Following ${userProfile.firstname}`)
            }
            setShowToast(true)
        } catch (error: any) {
            setToastMessage(error.error || 'Failed to update follow status')
            setShowToast(true)
        } finally {
            setFollowLoading(false)
        }
    }

    const handleViewThreadPost = (threadId: number) => {
        setSelectedThreadId(threadId)
        setShowViewModal(true)
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const formatThreadDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInMs = now.getTime() - date.getTime()
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

        if (diffInMinutes < 1) return 'Just now'
        if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`
        if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
        if (diffInDays < 7) return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
        if (diffInDays < 14) {
            const weeks = Math.floor(diffInDays / 7)
            return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
        }

        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
    }

    if (!userProfile) {
        return (
            <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Profile</IonTitle>
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
                    <div className='ion-text-center ion-padding'>
                        <IonSpinner />
                        <p>Loading profile...</p>
                    </div>
                </IonContent>
            </IonModal>
        )
    }

    const profilePicture = userProfile.profile_image_url || photoDefault

    return (
        <>
            <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{userProfile.firstname}'s Profile</IonTitle>
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
                    <IonGrid className='ion-text-center ion-padding'>
                        {/* Profile Avatar */}
                        <IonRow>
                            <IonCol>
                                <IonAvatar className='profile-avatar'>
                                    <img
                                        src={profilePicture}
                                        alt='profile'
                                        className='profile-image'
                                    />
                                </IonAvatar>
                                <br />
                                {/* Follow Button */}
                                <IonButton
                                    size='small'
                                    shape='round'
                                    fill='clear'
                                    onClick={handleFollow}
                                    color={isFollowing ? 'medium' : 'primary'}
                                >
                                    {followLoading ? (
                                        <IonSpinner name="dots" />
                                    ) : (
                                        <>
                                            <IonIcon 
                                                icon={isFollowing ? checkmarkCircleOutline : personAddOutline} 
                                                slot='start' 
                                            />
                                            {isFollowing ? 'Following' : 'Follow'}
                                        </>
                                    )}
                                </IonButton>
                            </IonCol>
                        </IonRow>

                        {/* User Name */}
                        <IonRow>
                            <IonCol>
                                <IonText>
                                    <h2 className='profile-name'>
                                        {userProfile.firstname} {userProfile.lastname}
                                    </h2>
                                </IonText>
                                <IonText>
                                    <p className='profile-email'>{userProfile.email}</p>
                                </IonText>
                            </IonCol>
                        </IonRow>

                        <IonRow className='ion-margin-top'>
                            <IonCol>
                                <IonText>{threads.length}</IonText>
                                <br />
                                <IonText>Threads</IonText>
                            </IonCol>
                            <IonCol
                                onClick={() => setShowFollowersModal(true)}
                                className='profile-follow-click'
                            >
                                <IonText>{followersCount}</IonText>
                                <br />
                                <IonText>Followers</IonText>
                            </IonCol>
                            <IonCol
                                onClick={() => setShowFollowingModal(true)}
                                className='profile-follow-click'
                            >
                                <IonText>{userProfile.following_count || 0}</IonText>
                                <br />
                                <IonText>Following</IonText>
                            </IonCol>
                        </IonRow>

                        {/* Segment Control */}
                        <IonRow className='ion-margin-top'>
                            <IonCol>
                                <IonSegment
                                    value={selectedSegment}
                                    onIonChange={(e) => setSelectedSegment(e.detail.value as string)}
                                >
                                    <IonSegmentButton value='threads'>
                                        <IonLabel>Threads</IonLabel>
                                    </IonSegmentButton>
                                    <IonSegmentButton value='about'>
                                        <IonLabel>About</IonLabel>
                                    </IonSegmentButton>
                                </IonSegment>
                            </IonCol>
                        </IonRow>

                        {/* Content based on selected segment */}
                        {selectedSegment === 'about' && (
                            <IonRow className='ion-margin-top ion-text-left'>
                                <IonCol>
                                    <IonItem lines='none' className='adjust-background'>
                                        <IonLabel>
                                            <h3>Email</h3>
                                            <p>{userProfile.email}</p>
                                        </IonLabel>
                                    </IonItem>

                                    <IonItem lines='none' className='adjust-background'>
                                        <IonLabel>
                                            <h3>Role</h3>
                                            <p>{userProfile.role_display}</p>
                                        </IonLabel>
                                    </IonItem>

                                    <IonItem lines='none' className='adjust-background'>
                                        <IonLabel>
                                            <h3>Course</h3>
                                            <p>{userProfile.course_display}</p>
                                        </IonLabel>
                                    </IonItem>

                                    <IonItem lines='none' className='adjust-background'>
                                        <IonLabel>
                                            <h3>Department</h3>
                                            <p>{userProfile.department_display}</p>
                                        </IonLabel>
                                    </IonItem>

                                    {userProfile.gender_display && (
                                        <IonItem lines='none' className='adjust-background'>
                                            <IonLabel>
                                                <h3>Gender</h3>
                                                <p>{userProfile.gender_display}</p>
                                            </IonLabel>
                                        </IonItem>
                                    )}

                                    {userProfile.created_at && (
                                        <IonItem lines='none' className='adjust-background'>
                                            <IonLabel>
                                                <h3>Date Joined</h3>
                                                <p>{formatDate(userProfile.created_at)}</p>
                                            </IonLabel>
                                        </IonItem>
                                    )}
                                </IonCol>
                            </IonRow>
                        )}

                        {selectedSegment === 'threads' && (
                            <IonRow className='ion-margin-top'>
                                <IonCol>
                                    {loading ? (
                                        <div className='ion-text-center ion-padding'>
                                            <IonSpinner />
                                            <p>Loading threads...</p>
                                        </div>
                                    ) : threads.length === 0 ? (
                                        <div className='profile-thread-center ion-text-center ion-padding'>
                                            <IonText>
                                                <h2 className='profile-thread-header'>No Threads Yet</h2>
                                            </IonText>
                                            <IonText>
                                                <p className='profile-thread-sub'>
                                                    This user hasn't posted any threads yet.
                                                </p>
                                            </IonText>
                                        </div>
                                    ) : (
                                        threads.map((thread) => {
                                            const filterContentLength = thread.content.length > 100
                                                ? thread.content.substring(0, 100) + '...'
                                                : thread.content

                                            return (
                                                <IonCard key={thread.id} className='home-thread-post ion-text-left'>
                                                    <IonCardContent>
                                                        <IonGrid>
                                                            {/* User Info */}
                                                            <IonRow className='ion-align-items-center'>
                                                                <IonCol size='auto'>
                                                                    <IonAvatar className='home-post-avatar'>
                                                                        <img
                                                                            src={profilePicture}
                                                                            alt='profile'
                                                                            className='home-post-photo'
                                                                        />
                                                                    </IonAvatar>
                                                                </IonCol>
                                                                <IonCol>
                                                                    <IonText>
                                                                        <h2 className='home-post-name'>
                                                                            {userProfile.firstname} {userProfile.lastname}
                                                                        </h2>
                                                                    </IonText>
                                                                    <IonText>
                                                                        <p className='home-post-date'>
                                                                            <small>{formatThreadDate(thread.created_at)}</small>
                                                                        </p>
                                                                    </IonText>
                                                                </IonCol>
                                                            </IonRow>

                                                            {/* Thread Content */}
                                                            <IonRow>
                                                                <IonCol>
                                                                    <IonText
                                                                        onClick={() => handleViewThreadPost(thread.id)}
                                                                        className='thread-title-click'
                                                                    >
                                                                        <h2 className='home-thread-title'>{thread.title}</h2>
                                                                    </IonText>
                                                                </IonCol>
                                                            </IonRow>
                                                            <IonRow>
                                                                <IonCol>
                                                                    <IonText>
                                                                        <p className='ion-margin-top home-thread-content'>
                                                                            {filterContentLength}
                                                                        </p>
                                                                    </IonText>
                                                                </IonCol>
                                                            </IonRow>

                                                            {/* Thread Image */}
                                                            {thread.image && (
                                                                <IonRow className='ion-margin-top'>
                                                                    <IonCol>
                                                                        <IonImg
                                                                            src={thread.image}
                                                                            alt='Thread post image'
                                                                            className='home-thread-image'
                                                                        />
                                                                    </IonCol>
                                                                </IonRow>
                                                            )}

                                                            {/* Actions */}
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
                                    )}
                                </IonCol>
                            </IonRow>
                        )}
                    </IonGrid>
                </IonContent>
            </IonModal>

            <ViewThread
                isOpen={showViewModal}
                onDidDismiss={() => {
                    setShowViewModal(false)
                    setSelectedThreadId(null)
                }}
                threadId={selectedThreadId}
                onThreadDeleted={fetchUserThreads}
                onThreadUpdated={fetchUserThreads}
            />

            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={2000}
                position='top'
            />

            <UserFollowers
                isOpen={showFollowersModal}
                onDidDismiss={() => setShowFollowersModal(false)}
                username={userProfile?.username || ''}
                onViewProfile={(profile) => {
                    setShowFollowersModal(false)
                    // You can add additional logic here if needed
                }}
            />

            <UserFollowing
                isOpen={showFollowingModal}
                onDidDismiss={() => setShowFollowingModal(false)}
                username={userProfile?.username || ''}
                onViewProfile={(profile) => {
                    setShowFollowingModal(false)
                }}
            />
        </>
    )
}

export default UserProfileView