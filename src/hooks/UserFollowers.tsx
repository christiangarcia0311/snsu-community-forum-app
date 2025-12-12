import React, { useState, useEffect } from 'react'

import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonItem,
    IonAvatar,
    IonLabel,
    IonText,
    IonSpinner,
    IonToast
} from '@ionic/react'

// icons
import {
    arrowForwardOutline,
    personAddOutline,
    checkmarkCircleOutline
} from 'ionicons/icons'

// default image
import photoDefault from '../assets/images/profile.png'

// services
import { getUserFollowers, followUser, unfollowUser } from '../services/AuthService'

interface UserFollowersProps {
    isOpen: boolean
    onDidDismiss: () => void
    username: string
    onViewProfile?: (userProfile: any) => void
}

interface FollowerData {
    id: number
    follower_username: string
    follower_profile: {
        firstname: string
        lastname: string
        email: string
        profile_image_url?: string | null
        is_following?: boolean
    }
    created_at: string
}

const UserFollowers: React.FC<UserFollowersProps> = ({
    isOpen,
    onDidDismiss,
    username,
    onViewProfile
}) => {
    const [followers, setFollowers] = useState<FollowerData[]>([])
    const [loading, setLoading] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [followingStates, setFollowingStates] = useState<{ [key: string]: boolean }>({})
    const [followLoadingStates, setFollowLoadingStates] = useState<{ [key: string]: boolean }>({})

    useEffect(() => {
        if (isOpen && username) {
            fetchFollowers()
        }
    }, [isOpen, username])

    const fetchFollowers = async () => {
        setLoading(true)
        try {
            const data = await getUserFollowers(username)
            setFollowers(data.followers || [])

            // Initialize following states
            const states: { [key: string]: boolean } = {}
            data.followers?.forEach((follower: FollowerData) => {
                states[follower.follower_username] = follower.follower_profile.is_following || false
            })
            setFollowingStates(states)
        } catch (error: any) {
            console.error('Failed to fetch followers:', error)
            setToastMessage(error.error || 'Failed to load followers')
            setShowToast(true)
        } finally {
            setLoading(false)
        }
    }

    const handleFollowToggle = async (followerUsername: string) => {
        if (followLoadingStates[followerUsername]) return

        setFollowLoadingStates(prev => ({ ...prev, [followerUsername]: true }))

        try {
            if (followingStates[followerUsername]) {
                await unfollowUser(followerUsername)
                setFollowingStates(prev => ({ ...prev, [followerUsername]: false }))
                setToastMessage(`Unfollowed ${followerUsername}`)
            } else {
                await followUser(followerUsername)
                setFollowingStates(prev => ({ ...prev, [followerUsername]: true }))
                setToastMessage(`Following ${followerUsername}`)
            }
            setShowToast(true)
        } catch (error: any) {
            setToastMessage(error.error || 'Failed to update follow status')
            setShowToast(true)
        } finally {
            setFollowLoadingStates(prev => ({ ...prev, [followerUsername]: false }))
        }
    }

    const handleProfileClick = (followerProfile: any) => {
        if (onViewProfile) {
            onViewProfile(followerProfile)
            onDidDismiss()
        }
    }

    const currentUser = localStorage.getItem('currentUser')
    const currentUsername = currentUser ? JSON.parse(currentUser).username : null

    return (
        <>
            <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
                <IonHeader>
                    <IonToolbar className='adjust-background'>
                        <IonTitle>Followers</IonTitle>
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
                    {loading ? (
                        <div className='ion-text-center ion-padding'>
                            <IonSpinner />
                            <p>Loading followers...</p>
                        </div>
                    ) : followers.length === 0 ? (
                        <div className='ion-text-center ion-padding'>
                            <IonText>
                                <h4 className='follow-header'>No followers yet</h4>
                                <p className='follow-sub-header'>When someone follows this user, they'll appear here.</p>
                            </IonText>
                        </div>
                    ) : (
                        <div className='ion-padding'>
                            {followers.map((follower) => {
                                const profilePicture = follower.follower_profile.profile_image_url || photoDefault
                                const isFollowing = followingStates[follower.follower_username]
                                const isFollowLoading = followLoadingStates[follower.follower_username]

                                return (
                                    <IonItem className='adjust-background' key={follower.id} lines='full'>
                                        <IonAvatar 
                                            slot='start' 
                                            onClick={() => handleProfileClick(follower.follower_profile)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <img src={profilePicture} alt='profile' />
                                        </IonAvatar>
                                        <IonLabel onClick={() => handleProfileClick(follower.follower_profile)} style={{ cursor: 'pointer' }}>
                                            <h2>
                                                {follower.follower_profile.firstname} {follower.follower_profile.lastname}
                                            </h2>
                                            <p>{follower.follower_profile.email}</p>
                                        </IonLabel>
                                        {follower.follower_username !== currentUsername && (
                                            <IonButton
                                                slot='end'
                                                size='small'
                                                fill='clear'
                                                onClick={() => handleFollowToggle(follower.follower_username)}
                                                color={isFollowing ? 'medium' : 'primary'}
                                            >
                                                {isFollowLoading ? (
                                                    <IonSpinner name='dots' />
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
                                        )}
                                    </IonItem>
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

export default UserFollowers