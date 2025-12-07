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
    IonImg,
    IonText,
    IonCard,
    IonCardContent,
    IonSpinner,
    IonToast,
    IonBadge,
    IonAvatar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonRefresher,
    IonRefresherContent,
    IonFab,
    IonFabButton,
    IonItem
} from '@ionic/react'

import {
    arrowForwardOutline,
    peopleOutline,
    lockClosedOutline,
    personAddOutline,
    checkmarkCircleOutline,
    addOutline,
    heartOutline,
    chatbubbleOutline
} from 'ionicons/icons'

import Banner from '../../assets/images/banner.jpeg'
import photoDefault from '../../assets/images/profile.png'

import { 
    getCommunityGroupById,
    getCommunityGroupPosts,
    joinCommunityGroup,
    leaveCommunityGroup
} from '../../services/CommunityService'

import { linkifyText } from '../../utils/linkify'
import '../../theme/variables.css'

interface ViewGroupProps {
    isOpen: boolean
    onDidDismiss: () => void
    groupId: number | null
}

interface CommunityGroup {
    id: number
    name: string
    description: string
    image: string | null
    created_by_username: string
    created_by_profile: any
    member_count: number
    is_member: boolean
    is_private: boolean
    user_role: string | null
    created_at: string
}

interface CommunityPost {
    id: number
    community: number
    community_name: string
    author: number
    author_username: string
    author_profile: any
    title: string
    content: string
    image: string | null
    created_at: string
    updated_at: string
    is_pinned: boolean
    can_edit: boolean
    can_delete: boolean
}

const ViewGroup: React.FC<ViewGroupProps> = ({
    isOpen,
    onDidDismiss,
    groupId
}) => {
    const [community, setCommunity] = useState<CommunityGroup | null>(null)
    const [posts, setPosts] = useState<CommunityPost[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedSegment, setSelectedSegment] = useState<string>('posts')
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [joinLoading, setJoinLoading] = useState(false)

    useEffect(() => {
        if (isOpen && groupId) {
            fetchCommunityDetails()
            fetchCommunityPosts()
        }
    }, [isOpen, groupId])

    const fetchCommunityDetails = async () => {
        if (!groupId) return
        
        setLoading(true)
        try {
            const data = await getCommunityGroupById(groupId)
            setCommunity(data)
        } catch (error: any) {
            setToastMessage(error.error || 'Failed to load community')
            setShowToast(true)
        } finally {
            setLoading(false)
        }
    }

    const fetchCommunityPosts = async () => {
        if (!groupId) return
        
        try {
            const data = await getCommunityGroupPosts(groupId)
            setPosts(data)
        } catch (error: any) {
            console.error('Failed to fetch posts:', error)
        }
    }

    const handleRefresh = async (event: CustomEvent) => {
        await Promise.all([
            fetchCommunityDetails(),
            fetchCommunityPosts()
        ])
        event.detail.complete()
    }

    const handleJoinLeave = async () => {
        if (!community) return

        setJoinLoading(true)
        try {
            if (community.is_member) {
                await leaveCommunityGroup(community.id)
                setToastMessage(`Left ${community.name}`)
            } else {
                await joinCommunityGroup(community.id)
                setToastMessage(`Joined ${community.name}`)
            }
            await fetchCommunityDetails()
        } catch (error: any) {
            setToastMessage(error.error || 'Action failed')
        } finally {
            setJoinLoading(false)
            setShowToast(true)
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
                        <IonTitle>{community?.name || 'Community'}</IonTitle>
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

                    {loading ? (
                        <div className='ion-text-center ion-padding'>
                            <IonSpinner />
                            <p>Loading community...</p>
                        </div>
                    ) : community ? (
                        <>
                            {/* Community Banner & Info */}
                            <IonImg 
                                src={community.image || Banner}
                                className='community-banner-image'
                            />
                            
                            <IonGrid className='ion-padding'>
                                <IonRow>
                                    <IonCol>
                                        <h1>
                                            {community.name}
                                            {community.is_private && (
                                                <IonIcon 
                                                    icon={lockClosedOutline} 
                                                    className='community-private-icon'
                                                    color='warning'
                                                />
                                            )}
                                        </h1>
                                        <IonText color='medium'>
                                            <p>
                                                {community.description}
                                            </p>
                                        </IonText>
                                        <IonText color='medium'>
                                            <small>
                                                {community.member_count} members
                                            </small>
                                        </IonText>
                                    </IonCol>
                                </IonRow>

                                <IonRow className='ion-margin-top'>
                                    <IonCol>
                                        <IonButton
                                            expand='block'
                                            onClick={handleJoinLeave}
                                            disabled={joinLoading}
                                            color={community.is_member ? 'medium' : 'primary'}
                                        >
                                            {joinLoading ? (
                                                <IonSpinner name='dots' />
                                            ) : (
                                                <>
                                                    <IonIcon 
                                                        icon={community.is_member ? checkmarkCircleOutline : personAddOutline} 
                                                        slot='start' 
                                                    />
                                                    {community.is_member ? 'Leave Group' : 'Join Group'}
                                                </>
                                            )}
                                        </IonButton>
                                    </IonCol>
                                </IonRow>

                                {/* Segment Control */}
                                <IonRow className='ion-margin-top'>
                                    <IonCol>
                                        <IonSegment
                                            value={selectedSegment}
                                            onIonChange={(e) => setSelectedSegment(e.detail.value as string)}
                                        >
                                            <IonSegmentButton value='posts'>
                                                <IonLabel>Posts</IonLabel>
                                            </IonSegmentButton>
                                            <IonSegmentButton value='about'>
                                                <IonLabel>About</IonLabel>
                                            </IonSegmentButton>
                                        </IonSegment>
                                    </IonCol>
                                </IonRow>

                                {/* Content based on segment */}
                                {selectedSegment === 'posts' && (
                                    <IonRow className='ion-margin-top'>
                                        <IonCol>
                                            {posts.length === 0 ? (
                                                <div className='ion-text-center ion-padding'>
                                                    <IonIcon 
                                                        icon={chatbubbleOutline} 
                                                        className='community-empty-icon'
                                                        color='medium' 
                                                    />
                                                    <IonText>
                                                        <h3>No Posts Yet</h3>
                                                        <p>Be the first to post in this community!</p>
                                                    </IonText>
                                                </div>
                                            ) : (
                                                posts.map((post) => {
                                                    const authorPic = post.author_profile?.profile_image_url || photoDefault
                                                    const authorName = post.author_profile
                                                        ? `${post.author_profile.firstname} ${post.author_profile.lastname}`
                                                        : post.author_username

                                                    return (
                                                        <IonCard key={post.id} className='adjust-background'>
                                                            <IonCardContent>
                                                                {/* Author Info */}
                                                                <IonGrid>
                                                                    <IonRow className='ion-align-items-center'>
                                                                        <IonCol size='auto'>
                                                                            <IonAvatar className='home-post-avatar'>
                                                                                <img src={authorPic} alt={authorName} className='home-post-photo' />
                                                                            </IonAvatar>
                                                                        </IonCol>
                                                                        <IonCol>
                                                                            <IonText>
                                                                                <h3 className='home-post-name' style={{ margin: 0 }}>{authorName}</h3>
                                                                                <p className='home-post-date'>
                                                                                    {formatDate(post.created_at)}
                                                                                </p>
                                                                            </IonText>
                                                                        </IonCol>
                                                                        {post.is_pinned && (
                                                                            <IonCol size='auto'>
                                                                                <IonBadge color='warning'>Pinned</IonBadge>
                                                                            </IonCol>
                                                                        )}
                                                                    </IonRow>

                                                                    {/* Post Content */}
                                                                    <IonRow className='ion-margin-top'>
                                                                        <IonCol>
                                                                            <h2 className='home-thread-title'>{post.title}</h2>
                                                                            <p className='home-thread-content'>{linkifyText(post.content)}</p>
                                                                            {post.image && (
                                                                                <IonImg 
                                                                                    src={post.image} 
                                                                                    className='home-post-photo'
                                                                                    style={{ 
                                                                                        borderRadius: '8px',
                                                                                        marginTop: '12px'
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </IonCol>
                                                                    </IonRow>

                                                                    {/* Action Buttons */}
                                                                    <IonRow className='ion-margin-top home-thread-actions'>
                                                                        <IonCol>
                                                                            <IonButton fill='clear' size='small' className='home-action-button'>
                                                                                <IonIcon icon={heartOutline} slot='start' />
                                                                                <IonText>Like</IonText>
                                                                            </IonButton>
                                                                        </IonCol>
                                                                        <IonCol>
                                                                            <IonButton fill='clear' size='small' className='home-action-button'>
                                                                                <IonIcon icon={chatbubbleOutline} slot='start' />
                                                                                <IonText>Comment</IonText>
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

                                {selectedSegment === 'about' && (
                                    <>
                                        <IonItem lines='none' className='adjust-background'>
                                            <IonLabel>
                                                <h3 className='profile-about-label'>About this community</h3>
                                                <p className='profile-thread-sub'>{community.description}</p>
                                            </IonLabel>
                                        </IonItem>
                                        <IonItem lines='none' className='adjust-background'>
                                            <IonLabel>
                                                <h3 className='profile-about-label'>Members</h3>
                                                <p className='profile-thread-sub'>{community.member_count}</p>
                                            </IonLabel>
                                        </IonItem>
                                        <IonItem lines='none' className='adjust-background'>
                                            <IonLabel>
                                                <h3 className='profile-about-label'>Author</h3>
                                                <p className='profile-thread-sub'>{community.created_by_username}</p>
                                            </IonLabel>
                                        </IonItem>
                                        <IonItem lines='none' className='adjust-background'>
                                            <IonLabel>
                                                <h3 className='profile-about-label'>Date created</h3>
                                                <p className='profile-thread-sub'>{formatDate(community.created_at)}</p>
                                            </IonLabel>
                                        </IonItem>
                                    </>
                                )}
                            </IonGrid>

                            {/* Floating Action Button for creating posts (if member) */}
                            {community.is_member && (
                                <IonFab vertical='bottom' horizontal='end' slot='fixed'>
                                    <IonFabButton>
                                        <IonIcon icon={addOutline} />
                                    </IonFabButton>
                                </IonFab>
                            )}
                        </>
                    ) : (
                        <div className='ion-text-center ion-padding'>
                            <IonText>
                                <h3>Community not found</h3>
                            </IonText>
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

export default ViewGroup