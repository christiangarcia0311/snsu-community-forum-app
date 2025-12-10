import React, { useState, useEffect } from 'react'

import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
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
    checkmarkCircleOutline
} from 'ionicons/icons'

// default image
import photoDefault from '../assets/images/profile.png'

// services
import { getUserFollowing, unfollowUser } from '../services/AuthService'

interface UserFollowingProps {
    isOpen: boolean
    onDidDismiss: () => void
    username: string
    onViewProfile?: (userProfile: any) => void
}

interface FollowingData {
    id: number
    following_username: string
    following_profile: {
        firstname: string
        lastname: string
        email: string
        profile_image_url?: string | null
    }
    created_at: string
}

const UserFollowing: React.FC<UserFollowingProps> = ({
    isOpen,
    onDidDismiss,
    username,
    onViewProfile
}) => {
    const [following, setFollowing] = useState<FollowingData[]>([])
    const [loading, setLoading] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [unfollowLoadingStates, setUnfollowLoadingStates] = useState<{ [key: string]: boolean }>({})

    useEffect(() => {
        if (isOpen && username) {
            fetchFollowing()
        }
    }, [isOpen, username])

    const fetchFollowing = async () => {
        setLoading(true)
        try {
            const data = await getUserFollowing(username)
            setFollowing(data.following || [])
        } catch (error: any) {
            console.error('Failed to fetch following:', error)
            setToastMessage(error.error || 'Failed to load following')
            setShowToast(true)
        } finally {
            setLoading(false)
        }
    }

    const handleUnfollow = async (followingUsername: string) => {
        if (unfollowLoadingStates[followingUsername]) return

        setUnfollowLoadingStates(prev => ({ ...prev, [followingUsername]: true }))

        try {
            await unfollowUser(followingUsername)
            setFollowing(prev => prev.filter(f => f.following_username !== followingUsername))
            setToastMessage(`Unfollowed ${followingUsername}`)
            setShowToast(true)
        } catch (error: any) {
            setToastMessage(error.error || 'Failed to unfollow')
            setShowToast(true)
        } finally {
            setUnfollowLoadingStates(prev => ({ ...prev, [followingUsername]: false }))
        }
    }

    const handleProfileClick = (followingProfile: any) => {
        if (onViewProfile) {
            onViewProfile(followingProfile)
            onDidDismiss()
        }
    }

    return (
        <>
            <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Following</IonTitle>
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
                            <p>Loading following...</p>
                        </div>
                    ) : following.length === 0 ? (
                        <div className='ion-text-center ion-padding'>
                            <IonText>
                                <h3 className='follow-header'>Not following anyone yet</h3>
                                <p className='follow-sub-header'>When this user follows someone, they'll appear here.</p>
                            </IonText>
                        </div>
                    ) : (
                        <div className='ion-padding'>
                            {following.map((follow) => {
                                const profilePicture = follow.following_profile.profile_image_url || photoDefault
                                const isUnfollowLoading = unfollowLoadingStates[follow.following_username]

                                return (
                                    <IonItem className='adjust-background'  key={follow.id} lines='full'>
                                        <IonAvatar 
                                            slot='start'
                                            onClick={() => handleProfileClick(follow.following_profile)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <img src={profilePicture} alt='profile' />
                                        </IonAvatar>
                                        <IonLabel onClick={() => handleProfileClick(follow.following_profile)} style={{ cursor: 'pointer' }}>
                                            <h2>
                                                {follow.following_profile.firstname} {follow.following_profile.lastname}
                                            </h2>
                                            <p>{follow.following_profile.email}</p>
                                        </IonLabel>
                                        <IonButton
                                            slot='end'
                                            size='small'
                                            fill='clear'
                                            color='medium'
                                            onClick={() => handleUnfollow(follow.following_username)}
                                        >
                                            {isUnfollowLoading ? (
                                                <IonSpinner name='dots' />
                                            ) : (
                                                <>
                                                    <IonIcon
                                                        icon={checkmarkCircleOutline}
                                                        slot='start'
                                                    />
                                                    Following
                                                </>
                                            )}
                                        </IonButton>
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

export default UserFollowing