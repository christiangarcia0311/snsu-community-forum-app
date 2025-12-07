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
    IonSpinner,
    IonText,
    IonSearchbar,
    IonRefresher,
    IonRefresherContent,
    IonToast
} from '@ionic/react'

import {
    arrowForwardOutline,
    personAddOutline,
    checkmarkCircleOutline
} from 'ionicons/icons'

import photoDefault from '../../assets/images/profile.png'

import UserProfileSheet from '../addons/ProfileSheet'
import UserProfileView from '../../hooks/UserProfileView'

import { getAllUsers, followUser, unfollowUser } from '../../services/AuthService'

interface UserData {
    username: string
    email: string
    firstname: string
    lastname: string
    profile_image_url?: string | null
    role: string
    department: string
    is_following: boolean
    followers_count: number
    following_count: number
}

interface UsersListProps {
    isOpen: boolean
    onDidDismiss: () => void
    onNavigateToProfile: () => void
}

const UsersList: React.FC<UsersListProps> = ({
    isOpen,
    onDidDismiss,
    onNavigateToProfile
}) => {
    const [users, setUsers] = useState<UserData[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [followLoadingStates, setFollowLoadingStates] = useState<{ [key: string]: boolean }>({})
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    const [showUserProfileSheet, setShowUserProfileSheet] = useState(false)
    const [showUserProfileView, setShowUserProfileView] = useState(false)
    const [selectedUserProfile, setSelectedUserProfile] = useState<any>(null)

    useEffect(() => {
        if (isOpen) {
            fetchAllUsers()
        }
    }, [isOpen])

    useEffect(() => {
        if (searchText.trim() === '') {
            setFilteredUsers(users)
        } else {
            const filtered = users.filter(user => 
                user.firstname.toLowerCase().includes(searchText.toLowerCase()) ||
                user.lastname.toLowerCase().includes(searchText.toLowerCase()) ||
                user.username.toLowerCase().includes(searchText.toLowerCase()) ||
                user.email.toLowerCase().includes(searchText.toLowerCase())
            )
            setFilteredUsers(filtered)
        }
    }, [searchText, users])

    const fetchAllUsers = async () => {
        setLoading(true)
        try {
            const data = await getAllUsers()
            setUsers(data.users || [])
            setFilteredUsers(data.users || [])
        } catch (error: any) {
            console.error('Failed to fetch users:', error)
            setToastMessage(error.error || 'Failed to load users')
            setShowToast(true)
        } finally {
            setLoading(false)
        }
    }

    const handleRefresh = async (event: CustomEvent) => {
        await fetchAllUsers()
        event.detail.complete()
    }

    const handleFollowToggle = async (username: string) => {
        if (followLoadingStates[username]) return

        setFollowLoadingStates(prev => ({ ...prev, [username]: true }))

        try {
            const user = users.find(u => u.username === username)
            if (!user) return

            if (user.is_following) {
                await unfollowUser(username)
                setUsers(prev =>
                    prev.map(u =>
                        u.username === username
                            ? { ...u, is_following: false, followers_count: u.followers_count - 1 }
                            : u
                    )
                )
                setToastMessage(`Unfollowed ${user.firstname} ${user.lastname}`)
            } else {
                await followUser(username)
                setUsers(prev =>
                    prev.map(u =>
                        u.username === username
                            ? { ...u, is_following: true, followers_count: u.followers_count + 1 }
                            : u
                    )
                )
                setToastMessage(`Following ${user.firstname} ${user.lastname}`)
            }
            setShowToast(true)
        } catch (error: any) {
            setToastMessage(error.error || 'Failed to update follow status')
            setShowToast(true)
        } finally {
            setFollowLoadingStates(prev => ({ ...prev, [username]: false }))
        }
    }

    const handleViewUserProfile = async (userProfile: any) => {
        setSelectedUserProfile(userProfile)
        setShowUserProfileSheet(true)
    }

    const handleViewOtherUserProfile = async (userProfile: any) => {
        setSelectedUserProfile(userProfile)
        setShowUserProfileSheet(false)
    }

    const handleOpenFullProfile = () => {
        setShowUserProfileSheet(false)
        setShowUserProfileView(true)
    }

    return (
        <>
            <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Discover People</IonTitle>
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

                    <div className='ion-padding'>
                        <IonSearchbar
                            value={searchText}
                            onIonInput={(e) => setSearchText(e.detail.value || '')}
                            placeholder='Search users by name, username or email...'
                            showClearButton='always'
                        />
                    </div>

                    {loading ? (
                        <div className='ion-text-center ion-padding'>
                            <IonSpinner />
                            <p>Loading users...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className='ion-text-center ion-padding'>
                            <IonText>
                                <h4>No users found</h4>
                                <p>
                                    {searchText
                                        ? 'Try a different search term'
                                        : 'No users available to follow'}
                                </p>
                            </IonText>
                        </div>
                    ) : (
                        <div>
                            {filteredUsers.map((user) => {
                                const profilePicture = user.profile_image_url || photoDefault
                                const isFollowing = user.is_following
                                const isFollowLoading = followLoadingStates[user.username]

                                return (
                                    <IonItem className='adjust-background' key={user.username} lines='full'>
                                        <IonAvatar
                                            slot='start'
                                            onClick={() => handleViewUserProfile(user)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <img src={profilePicture} alt='profile' />
                                        </IonAvatar>
                                        <IonLabel
                                            onClick={() => handleViewUserProfile(user)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <h2>
                                                {user.firstname} {user.lastname}
                                            </h2>
                                            <p>
                                                <small>@{user.email}</small>
                                            </p>
                                            <p>
                                                <small>
                                                    {user.followers_count} followers • {user.following_count} following
                                                </small>
                                            </p>
                                        </IonLabel>
                                        <IonButton
                                            slot='end'
                                            size='small'
                                            fill='clear'
                                            onClick={() => handleFollowToggle(user.username)}
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
                                    </IonItem>
                                )
                            })}
                        </div>
                    )}
                </IonContent>
            </IonModal>

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

export default UsersList