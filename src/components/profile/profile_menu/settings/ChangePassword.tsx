import React, { useState } from 'react'
import { IonModal, IonHeader, IonToolbar, IonTitle, IonIcon, IonButton, IonContent, IonInput, IonGrid, IonRow, IonCol, IonLoading, IonToast, IonText, IonItem } from '@ionic/react'
import { arrowForwardOutline } from 'ionicons/icons'
import { changePassword, getUserProfile } from '../../../../services/AuthService'
import { informationCircleOutline } from 'ionicons/icons'
import { useEffect } from 'react'

const ChangePassword: React.FC<{ isOpen: boolean; onDidDismiss: () => void }> = ({ isOpen, onDidDismiss }) => {
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' })
    const [canChangePassword, setCanChangePassword] = useState<boolean | null>(null)
    const [daysRemaining, setDaysRemaining] = useState<number>(0)

    const resetFields = () => {
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
    }

    const handleDismiss = () => {
        // clear fields when modal closes
        resetFields()
        // reset cooldown state
        setCanChangePassword(null)
        setDaysRemaining(0)
        // propagate dismiss to parent
        onDidDismiss()
    }

    useEffect(() => {
        const fetch = async () => {
            if (!isOpen) return
            try {
                const profile = await getUserProfile()
                setCanChangePassword(profile.can_change_password ?? true)
                setDaysRemaining(profile.days_until_password_change ?? 0)
            } catch {
                // ignore fetch errors; default to allowing change
                setCanChangePassword(true)
                setDaysRemaining(0)
            }
        }

        fetch()
    }, [isOpen])

    const handleSubmit = async () => {
        setLoading(true)
        try {
            await changePassword(oldPassword, newPassword, confirmPassword)
            // clear inputs and inform user
            resetFields()
            setToast({ show: true, message: 'Password changed successfully. You can change your password again in 14 days.' })
            // close modal shortly after success
            setTimeout(() => handleDismiss(), 1200)
        } catch (err: unknown) {
            // try to read structured error (days remaining) from server
            let message = 'Failed to change password'

            const maybeResponse = err as { response?: { data?: unknown } } | undefined
            const data = maybeResponse && (maybeResponse.response?.data ?? err) ? (maybeResponse.response?.data ?? err) : err

            if (data) {
                if (typeof data === 'string') {
                    message = data
                } else if (typeof data === 'object' && data !== null) {
                    const d = data as Record<string, unknown>
                    if (typeof d.error === 'string') message = d.error
                    else if (typeof d.detail === 'string') message = d.detail

                    const days = (d['days_remaining'] ?? d['days_until_next_update'] ?? d['days']) as number | undefined
                    if (typeof days === 'number' && days > 0) {
                        message = `You can change password again in ${days} day(s).`
                    }
                }
            }

            setToast({ show: true, message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <IonModal isOpen={isOpen} onDidDismiss={handleDismiss}>
            <IonHeader>
                <IonToolbar className='adjust-background'>
                    <IonTitle>Change Password</IonTitle>
                    <IonButton slot="end" fill="clear" onClick={onDidDismiss}>
                        <IonIcon icon={arrowForwardOutline} size='large' />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            {canChangePassword === false && (
                                <div>
                                    <IonItem lines="none" className="adjust-background ion-margin-vertical">
                                        <IonIcon color='warning' icon={informationCircleOutline} slot="start" />
                                        <IonText color='warning'>
                                            You cannot change your password for <strong>{daysRemaining} day(s)</strong>. Password changes are allowed once every 14 days.
                                        </IonText>
                                    </IonItem>
                                </div>
                            )}
                            <IonInput className='ion-margin-top' fill='outline' type="password" placeholder="Old password" value={oldPassword} onIonChange={e => setOldPassword(e.detail.value!)} disabled={canChangePassword === false || loading} />
                            <IonInput className='ion-margin-top' fill='outline' type="password" placeholder="New password" value={newPassword} onIonChange={e => setNewPassword(e.detail.value!)} disabled={canChangePassword === false || loading} />
                            <IonInput className='ion-margin-top' fill='outline' type="password" placeholder="Confirm new password" value={confirmPassword} onIonChange={e => setConfirmPassword(e.detail.value!)} disabled={canChangePassword === false || loading} />
                            <IonButton className='ion-margin-top auth-signup' expand="block" onClick={handleSubmit} disabled={loading || canChangePassword === false}>Change Password</IonButton>
                            
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
            <IonLoading isOpen={loading} message="Please wait..." />
            <IonToast isOpen={toast.show} message={toast.message} duration={3000} onDidDismiss={() => setToast({ show: false, message: '' })} />
        </IonModal>
    )
}

export default ChangePassword