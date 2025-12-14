import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
	IonPage,
	IonContent,
	IonGrid,
	IonRow,
	IonCol,
	IonInput,
	IonButton,
	IonLoading,
	IonAlert,
	IonTitle,
	IonToolbar,
	IonFooter,
	IonLabel
} from '@ionic/react'

import axios from 'axios'
import { verifyOTP, resendOTP } from '../../../services/AuthService'
import { useLocation } from 'react-router-dom'

const Verification: React.FC = () => {
	const history = useHistory()

	const location = useLocation()
	const state = (location.state ?? {}) as Record<string, unknown>
	const prefilledUsername = (state['username'] as string) || localStorage.getItem('pending_verification_username') || ''
	const [username, setUsername] = useState(prefilledUsername)
	const [otpCode, setOtpCode] = useState('')
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState('')
	const [showMessage, setShowMessage] = useState(false)

	const handleVerify = async () => {
		if (!username.trim() || !otpCode.trim()) {
			setMessage('Please enter username and verification code')
			setShowMessage(true)
			return
		}

		setLoading(true)
		try {
			await verifyOTP(username, otpCode)
			setMessage('Verification successful. Redirecting to sign in...')
			setShowMessage(true)
			setTimeout(() => history.push('/auth/signin'), 1500)
		} catch (err: unknown) {
			let errMsg = 'Verification failed'
			if (axios.isAxiosError(err) && err.response?.data) {
				const data = err.response.data as Record<string, unknown>
				errMsg = (data['error'] as string) || (data['detail'] as string) || JSON.stringify(data)
			} else if (err instanceof Error) {
				errMsg = err.message
			}
			setMessage(errMsg)
			setShowMessage(true)
		} finally {
			setLoading(false)
		}
	}

	const handleResend = async () => {
		if (!username.trim()) {
			setMessage('Please enter your username to resend code')
			setShowMessage(true)
			return
		}

		setLoading(true)
		try {
			await resendOTP(username)
			setMessage('Verification code resent to your email')
			setShowMessage(true)
		} catch (err: unknown) {
			let errMsg = 'Failed to resend code'
			if (axios.isAxiosError(err) && err.response?.data) {
				const data = err.response.data as Record<string, unknown>
				errMsg = (data['error'] as string) || JSON.stringify(data)
			} else if (err instanceof Error) {
				errMsg = err.message
			}
			setMessage(errMsg)
			setShowMessage(true)
		} finally {
			setLoading(false)
		}
	}

	return (
		<IonPage>
			<IonContent className='ion-padding'>
				<IonGrid>
					<IonRow className='ion-justify-content-center ion-margin-top'>
						<IonCol sizeMd='6' sizeSm='12' sizeXs='12'>
							<IonTitle className='ion-text-center'>Account Verification</IonTitle>

							{ !prefilledUsername && (
								<IonInput
									value={username}
									placeholder='Enter username'
									onIonChange={(e) => setUsername(e.detail.value!)}
									className='ion-margin-top'
								/>
							) }

							<IonLabel>
								<h2>Verify your Account</h2>
								<p>Please Check your inbox or spam for verification code.</p>
							</IonLabel>

							<IonInput
								value={otpCode}
								placeholder='Enter verification code'
								onIonChange={(e) => setOtpCode(e.detail.value!)}
								className='ion-margin-top'
                                fill='outline'
							/>

							<IonRow className='ion-margin-top'>
								<IonCol>
									<IonButton expand='block' onClick={handleVerify}>Verify</IonButton>
								</IonCol>
								<IonCol>
									<IonButton expand='block' color='medium' onClick={handleResend}>Resend</IonButton>
								</IonCol>
							</IonRow>
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonContent>

			<IonFooter>
				<IonToolbar>
				</IonToolbar>
			</IonFooter>

			<IonLoading isOpen={loading} message={'Please wait...'} />

			<IonAlert
				isOpen={showMessage}
				onDidDismiss={() => setShowMessage(false)}
				message={message}
			/>
		</IonPage>
	)
}

export default Verification
