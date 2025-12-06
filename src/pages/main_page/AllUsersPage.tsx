import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'

import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonBadge,
    IonSpinner,
    IonText,
    IonSearchbar,
    IonRefresher,
    IonRefresherContent,
    IonToast
} from '@ionic/react'

// icons
import {
    arrowBackOutline,
    personAddOutline,
    checkmarkCircleOutline
} from 'ionicons/icons'

// default image
import photoDefault from '../../assets/images/profile.png'

// services
import { getAllUsers, followUser, unfollowUser, getUserProfile } from '../../services/AuthService'

// components
import UserProfileSheet from '../../components/addons/ProfileSheet'
import UserProfileView from '../../hooks/UserProfileView'

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

const AllUsersPage: React.FC = () => {
    const history = useHistory()

    const [users, setUsers] = useState<UserData[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState('')
    const [followLoadingStates, setFollowLoadingStates] = useState<{ [key: string]: boolean }>({})
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    const [showUserProfileSheet, setShowUserProfileSheet] = useState(false)
    const [showUserProfileView, setShowUserProfileView] = useState(false)
    const [selectedUserProfile, setSelectedUserProfile] = useState<any>(null)

    useEffect(() => {
        fetchAllUsers()
        fetchNotificationCount()
    }, [])

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

    const fetchNotificationCount = async () => {
        // This can be implemented if needed
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

    const handleViewOtherUserProfile = async (userProfile: any) => {
        try {
            const currentUser = await getUserProfile()
            
            if (currentUser.username === userProfile.username) {
                history.push('/tabs/profile')
            } else {
                setSelectedUserProfile(userProfile)
                setShowUserProfileSheet(false)
            }
        } catch (error) {
            console.error('Failed to check user profile:', error)
            setSelectedUserProfile(userProfile)
            setShowUserProfileSheet(false)
        }
    }

    const handleOpenFullProfile = () => {
        setShowUserProfileSheet(false)
        setShowUserProfileView(true)
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className='home-header-bg'>
                    <IonButton
                        slot='start'
                        fill='clear'
                        onClick={() => history.goBack()}
                    >
                        <IonIcon icon={arrowBackOutline} className='home-icon' />
                    </IonButton>
                    <IonTitle>
                        <h2>Discover People</h2>
                    </IonTitle>
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
                                <IonItem className='adjust-background' key={user.username} lines='none'>
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
                                                {user.followers_count} followers and {user.following_count} following
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
        </IonPage>
    )
}

export default AllUsersPage
