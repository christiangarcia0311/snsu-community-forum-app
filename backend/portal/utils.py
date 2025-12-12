import pyotp
from django.conf import settings
from django.core.mail import send_mail
import logging
from .models import UserOTP
from django.utils import timezone


def create_send_otp_verification_code(user, request=None, force_regen: bool = False):
    
    '''
    Create a pyotp and send in user email
    '''
    
    otp_obj, _created = UserOTP.objects.get_or_create(user=user)

    if not otp_obj.secret or force_regen:
        otp_obj.secret = pyotp.random_base32()
        otp_obj.is_verified = False
        otp_obj.updated_at = timezone.now()
        otp_obj.save()

    totp = pyotp.TOTP(otp_obj.secret)
    code = totp.now()
    
    subject = 'Stream - Verify your account'
    firstname = getattr(getattr(user, 'profile', None), 'firstname', None) or user.username
    message = f'Hello {firstname},\n\nYour verification code is: {code}\n\nThis code is valid for a short time. If you did not request this, please ignore this message.'
    
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', settings.EMAIL_HOST_USER if hasattr(settings, 'EMAIL_HOST_USER') else None)
    recipient = [user.email]
    
    try:
        send_mail(subject, message, from_email, recipient, fail_silently=False)
    except Exception as exc:
        # don't break signup if SMTP is not available; log and continue
        logger = logging.getLogger(__name__)
        logger.exception('Failed to send OTP email for user %s: %s', user.username, exc)

    return otp_obj
    