import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'

import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
  IonIcon,
  IonAlert,
  IonMenu,
  IonMenuButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonText,
  IonRow,
  IonCol,
  IonGrid,
  IonAvatar,
  IonSegment,
  IonSegmentButton,
  IonLoading,
  IonActionSheet,
  IonToast,
  IonRefresher,
  IonRefresherContent
} from '@ionic/react'

// icons
import {
  personCircleOutline,
  chevronForwardOutline,
  bookmarkOutline,
  podiumOutline,
  notifications,
  lockClosedOutline,
  personAddOutline,
  repeatOutline,
  phonePortraitOutline,
  peopleOutline,
  peopleCircleOutline,
  helpBuoyOutline,
  informationCircleOutline,
  camera,
  image,
  trash
} from 'ionicons/icons'

// image
import Profile from '../../assets/images/profile.png'

// services
import {
  logoutUser,
  getUserProfile,
  updateProfileImage,
} from '../../services/AuthService'
import { getUserThreadPost } from '../../services/ThreadService'

// -- COMPONENTS --
import AboutProfile from '../../components/profile/AboutProfile'
import ThreadPost from '../../components/profile/ThreadPost'


// -- FOLLOW --
import UserFollowers from '../../hooks/UserFollowers'
import UserFollowing from '../../hooks/UserFollowing'
import UserProfileView from '../../hooks/UserProfileView'

// -- MODAL COMPONENTS --
import AccountSettings from '../../components/profile/profile_menu/AccountSettings'

interface UserProfileData {
  username: string
  email: string
  firstname: string
  lastname: string
  birth_date: string
  gender: string
  gender_display: string
  role: string
  role_display: string
  department: string
  department_display: string
  course: string
  course_display: string
  profile_image: string | null
  profile_image_url: string | null
  created_at: string
  can_update_profile?: boolean
  days_until_next_update?: number
  followers_count?: number
  following_count?: number
}

const ProfilePage = () => {
  const history = useHistory();

  const [showLogoutAlert, setShowLogoutAlert] = useState(false)
  const [loadingNavigate, setLoadingNavigate] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [showActionSheet, setShowActionSheet] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [selectedSegment, setSelectedSegment] = useState<string>('threads')

  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null)
  const [profileImage, setProfileImage] = useState<string>(Profile)
  
  // -- STATS --
  const [threadCount, setThreadCount] = useState(0)

  // -- FOLLOW USER LIST --
  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [showFollowingModal, setShowFollowingModal] = useState(false)
  const [showUserProfileView, setShowUserProfileView] = useState(false)
  const [selectedUserProfile, setSelectedUserProfile] = useState<any>(null)

  // -- USER PROFILE MENU --
  const [showAccountSettings, setShowAccountSettings] = useState(false)

  useEffect(() => {
    fetchUserProfile()
    fetchThreadPostCount()
  }, []);

  const handleRefresh = async (event: CustomEvent) => {
    await Promise.all([
      fetchUserProfile(),
      fetchThreadPostCount()
    ])
    event.detail.complete()
  }

  // -- FETCH USER DETAILS --
  const fetchUserProfile = async () => {
    setLoadingProfile(true);

    try {
      const profile = await getUserProfile();
      setUserProfile(profile);

      if (profile.profile_image_url) {
        setProfileImage(profile.profile_image_url);
      }

      setLoadingProfile(false);
    } catch (error: any) {
      console.error("Failed to fetch profile:", error);
      setLoadingProfile(false);
      setToastMessage("Failed to load profile");
      setShowToast(true);
    }
  }

  const fetchThreadPostCount = async () => {
    try {
      const threads = await getUserThreadPost()
      setThreadCount(threads.length)
    } catch (error) {
      console.error(`Failed to fetch thread count: ${error}`)
      setThreadCount(0)
    }
  }

  // -- IMAGE PROFILE UPLOAD --
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // -- VALIDATE FILE TYPE --
    if (!file.type.startsWith("image/")) {
      setToastMessage("Please select a valid image file");
      setShowToast(true);
      return;
    }

    // -- FILE SIZE MAX TO 5MB --
    if (file.size > 5 * 1024 * 1024) {
      setToastMessage("Image size should be less than 5MB");
      setShowToast(true);
      return;
    }

    setLoadingNavigate(true);

    try {
      const response = await updateProfileImage(file);

      // -- UPDATE PHOTO --
      if (response.profile?.profile_image_url) {
        setProfileImage(response.profile.profile_image_url);
      }

      setToastMessage("Profile image updated successfully");
      setShowToast(true);
      setLoadingNavigate(false);

      // -- REFRESH PROFILE DATA --
      fetchUserProfile();
    } catch (error: any) {
      console.error("Failed to update image:", error);
      setToastMessage(error.error || "Failed to update profile image");
      setShowToast(true);
      setLoadingNavigate(false);
    }
  };

  // -- HANDLE CHOOSEN PHOTOS --
  const handleTakePhoto = () => {
    // -- FOR NATIVE DEVICE --
    setToastMessage("Camera feature coming soon!");
    setShowToast(true);
    setShowActionSheet(false);
  };

  const handleChooseFromGallery = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => handleImageUpload(e as any);
    input.click();
    setShowActionSheet(false);
  };

  const handleRemovePhoto = async () => {
    setProfileImage(Profile);
    setToastMessage("Profile image removed");
    setShowToast(true);
    setShowActionSheet(false);
  };

  const handleViewUserProfile = (userProfile: any) => {
    setSelectedUserProfile(userProfile)
    setShowUserProfileView(true)
  }

  // -- LOGOUT USER --
  const handleLogout = () => {
    setLoadingNavigate(true);

    setTimeout(() => {
      setLoadingNavigate(false);
      logoutUser();
      history.push("/auth/signin");
    }, 800);
  };
  return (
    <>
      {/* MENU PROFILE CONTENT */}
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar className='home-header-bg'>
            <IonTitle>Settings and Activity</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <p className="txt-highlight">Your account</p>
          <IonItem lines="none" className="adjust-background ion-margin-bottom">
            <IonLabel>
              <IonButton 
                fill="clear"
                onClick={() => setShowAccountSettings(true)}
              >
                <IonIcon
                  icon={personCircleOutline}
                  slot="start"
                  size="large"
                  aria-hidden="true"
                />
                <IonText>Account Settings</IonText>
                <IonIcon icon={chevronForwardOutline} slot="end" />
              </IonButton>
              <IonLabel>
                <p className="txt-highlight-description">
                  Profile details, password, security and preferences
                </p>
              </IonLabel>
            </IonLabel>
          </IonItem>

          <p className="txt-highlight">How you use stream</p>
          <IonItem className="adjust-background">
            <IonLabel>
              <IonButton fill="clear">
                <IonIcon
                  icon={bookmarkOutline}
                  slot="start"
                  size="large"
                  aria-hidden="true"
                />
                <IonText>Saved Thread</IonText>
                <IonIcon icon={chevronForwardOutline} slot="end" />
              </IonButton>
            </IonLabel>
          </IonItem>
          <IonItem className="adjust-background">
            <IonLabel>
              <IonButton fill="clear">
                <IonIcon
                  icon={podiumOutline}
                  slot="start"
                  size="large"
                  aria-hidden="true"
                />
                <IonText>Your Activity</IonText>
                <IonIcon icon={chevronForwardOutline} slot="end" />
              </IonButton>
            </IonLabel>
          </IonItem>
          <IonItem className="adjust-background">
            <IonLabel>
              <IonButton fill="clear">
                <IonIcon
                  icon={notifications}
                  slot="start"
                  size="large"
                  aria-hidden="true"
                />
                <IonText>Notifications</IonText>
                <IonIcon icon={chevronForwardOutline} slot="end" />
              </IonButton>
            </IonLabel>
          </IonItem>
          <IonItem className="adjust-background">
            <IonLabel>
              <IonButton fill="clear">
                <IonIcon
                  icon={peopleCircleOutline}
                  slot="start"
                  size="large"
                  aria-hidden="true"
                />
                <IonText>Community Forum</IonText>
                <IonIcon icon={chevronForwardOutline} slot="end" />
              </IonButton>
            </IonLabel>
          </IonItem>
          <IonItem className="adjust-background">
            <IonLabel>
              <IonButton fill="clear">
                <IonIcon
                  icon={peopleOutline}
                  slot="start"
                  size="large"
                  aria-hidden="true"
                />
                <IonText>People Connected</IonText>
                <IonIcon icon={chevronForwardOutline} slot="end" />
              </IonButton>
            </IonLabel>
          </IonItem>
          <br />

          <p className="txt-highlight">Who can see your thread post</p>
          <IonItem className="adjust-background">
            <IonLabel>
              <IonButton fill="clear">
                <IonIcon
                  icon={lockClosedOutline}
                  slot="start"
                  size="large"
                  aria-hidden="true"
                />
                <IonText>Account Privacy</IonText>
                <IonIcon icon={chevronForwardOutline} slot="end" />
              </IonButton>
            </IonLabel>
          </IonItem>
          <br />

          <p className="txt-highlight">How others can interact with you</p>
          <IonItem className="adjust-background">
            <IonLabel>
              <IonButton fill="clear">
                <IonIcon
                  icon={repeatOutline}
                  slot="start"
                  size="large"
                  aria-hidden="true"
                />
                <IonText>Sharing Content</IonText>
                <IonIcon icon={chevronForwardOutline} slot="end" />
              </IonButton>
            </IonLabel>
          </IonItem>
          <IonItem className="adjust-background">
            <IonLabel>
              <IonButton fill="clear">
                <IonIcon
                  icon={personAddOutline}
                  slot="start"
                  size="large"
                  aria-hidden="true"
                />
                <IonText>Follow and invite</IonText>
                <IonIcon icon={chevronForwardOutline} slot="end" />
              </IonButton>
            </IonLabel>
          </IonItem>

          <br />

          <p className="txt-highlight">Your app and media</p>
          <IonItem className="adjust-background">
            <IonLabel>
              <IonButton fill="clear">
                <IonIcon
                  icon={phonePortraitOutline}
                  slot="start"
                  size="large"
                  aria-hidden="true"
                />
                <IonText>Device Permission</IonText>
                <IonIcon icon={chevronForwardOutline} slot="end" />
              </IonButton>
            </IonLabel>
          </IonItem>
          <br />

          <p className="txt-highlight">More info and support</p>
          <IonItem className="adjust-background">
            <IonLabel>
              <IonButton fill="clear">
                <IonIcon
                  icon={helpBuoyOutline}
                  slot="start"
                  size="large"
                  aria-hidden="true"
                />
                <IonText>Help</IonText>
                <IonIcon icon={chevronForwardOutline} slot="end" />
              </IonButton>
            </IonLabel>
          </IonItem>
          <IonItem className="adjust-background">
            <IonLabel>
              <IonButton fill="clear">
                <IonIcon
                  icon={informationCircleOutline}
                  slot="start"
                  size="large"
                  aria-hidden="true"
                />
                <IonText>About</IonText>
                <IonIcon icon={chevronForwardOutline} slot="end" />
              </IonButton>
            </IonLabel>
          </IonItem>

          <br />

          <p className="txt-highlight">Sign in</p>
          <IonItem className="adjust-background">
            <IonLabel>
              <IonButton
                fill="clear"
                className="auth-profile"
                color="danger"
                onClick={() => setShowLogoutAlert(true)}
              >
                <IonAvatar slot='start' className="profile-avatar-logout">
                  <img
                    src={profileImage}
                    alt="profile"
                    className="profile-image"
                  />
                </IonAvatar>&nbsp;&nbsp;&nbsp;
                <IonText>Logout {userProfile?.lastname}</IonText>
              </IonButton>
            </IonLabel>
          </IonItem>

          {/* -- PROFILE MODAL -- */}
          <AccountSettings
            isOpen={showAccountSettings}
            onDidDismiss={() => setShowAccountSettings(false)}
            onProfileUpdate={fetchUserProfile}
          />


          {/* -- LOGOUT ALERT CONFIRMATION AND ACTIONS -- */}
          <IonAlert
            isOpen={showLogoutAlert}
            onDidDismiss={() => setShowLogoutAlert(false)}
            header="Logout"
            message="Are you sure you want to logout?"
            buttons={[
              {
                text: "Cancel",
                role: "cancel",
              },
              {
                text: "Logout",
                handler: handleLogout,
              },
            ]}
          />

          <IonLoading
            isOpen={loadingNavigate}
            message={"Logging out..."}
            spinner="dots"
          />

        </IonContent>
      </IonMenu>

      {/* PROFILE PAGE CONTENT */}
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar className='home-header-bg'>
            <IonButtons slot="end">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Profile</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>

          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent
              pullingIcon="chevron-down-circle-outline"
              pullingText="Pull to refresh"
              refreshingSpinner="circles"
              refreshingText="Refreshing..."
            />
          </IonRefresher>
          
          <IonGrid className="ion-text-center ion-padding">
            <IonRow>
              <IonCol>
                <IonAvatar className="profile-avatar">
                  <img
                    src={profileImage}
                    alt="profile"
                    className="profile-image"
                  />
                </IonAvatar><br />
                <IonButton
                  size="small"
                  shape="round"
                  onClick={() => setShowActionSheet(true)}
                  className="profile-edit"
                  fill="clear"
                >
                  <IonIcon icon={camera} slot="start" />
                  Edit Profile
                </IonButton>

                <IonText>
                  <h2 className="profile-name">
                    {userProfile?.firstname} {userProfile?.lastname}
                  </h2>
                </IonText>
                <IonText>
                  <p className="profile-email">{userProfile?.email}</p>
                </IonText>
              </IonCol>
            </IonRow>

            <IonRow className="ion-margin-top">
              <IonCol>
                <IonText>{threadCount}</IonText>
                <br />
                <IonText>Threads</IonText>
              </IonCol>

              <IonCol
                onClick={() => setShowFollowersModal(true)}
                className='profile-follow-click'
              >
                <IonText>{userProfile?.followers_count || 0}</IonText>
                <br />
                <IonText>Followers</IonText>
              </IonCol>

              <IonCol
                onClick={() => setShowFollowingModal(true)}
                className='profile-follow-click'
              >
                <IonText>{userProfile?.following_count || 0}</IonText>
                <br />
                <IonText>Following</IonText>
              </IonCol>
            </IonRow>

            <IonRow className="ion-margin-top">
              <IonCol>
                <IonSegment
                  value={selectedSegment} 
                  onIonChange={(e) => setSelectedSegment(e.detail.value as string)}
                >
                  <IonSegmentButton value="threads">
                    <IonLabel>Threads</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="about">
                    <IonLabel>About</IonLabel>
                  </IonSegmentButton>
                </IonSegment>

                {/* CONTENTS */}
                {
                  selectedSegment === 'threads' && (
                    <div>
                      <ThreadPost />
                    </div>
                  )
                }

                {
                  selectedSegment === 'about' && userProfile && (
                    <AboutProfile userProfile={userProfile} />
                  )
                }
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* LOADING INDICATOR */}
          <IonLoading
            isOpen={loadingProfile}
            message={"Loading profile..."}
            spinner="dots"
          />
        </IonContent>

        {/* ACTIONS FOR UPLOADING IMAGE */}
        <IonActionSheet
            isOpen={showActionSheet}
            onDidDismiss={() => setShowActionSheet(false)}
            header='Profile Photo'
            buttons={[
                {
                    text: 'Take Photo',
                    icon: camera,
                    handler: handleTakePhoto
                },
                {
                    text: 'Choose from Gallery',
                    icon: image,
                    handler: handleChooseFromGallery
                },
                {
                    text: 'Remove Photo',
                    icon: trash,
                    role: 'destructive',
                    handler: handleRemovePhoto
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]}
        />

        {/* NOTIFICATION MESSAGE */}
        <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={toastMessage}
            duration={2000}
            position='bottom'
        />
      </IonPage>

      {/* FOLLOW USER */}
      <UserFollowers
        isOpen={showFollowersModal}
        onDidDismiss={() => setShowFollowersModal(false)}
        username={userProfile?.username || ''}
        onViewProfile={handleViewUserProfile}
      />

      <UserFollowing
        isOpen={showFollowingModal}
        onDidDismiss={() => setShowFollowingModal(false)}
        username={userProfile?.username || ''}
        onViewProfile={handleViewUserProfile}
      />

      <UserProfileView
        isOpen={showUserProfileView}
        onDidDismiss={() => {
          setShowUserProfileView(false)
          setSelectedUserProfile(null)
        }}
        userProfile={selectedUserProfile}
        onViewProfile={handleViewUserProfile}
      />
    </>
  )
}

export default ProfilePage;
