"""
WSGI config for stream project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from dotenv import load_dotenv

load_dotenv()

from django.core.wsgi import get_wsgi_application
from django.conf import settings
from whitenoise import WhiteNoise

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stream.settings')

application = get_wsgi_application()

# In production, WhiteNoise can also serve user-uploaded media files.
# WhiteNoise is already present in middleware; here we wrap the WSGI
# application and register the MEDIA_ROOT path under the 'media/' prefix
# so files are available at /media/ when DEBUG is False.
try:
	static_root = getattr(settings, 'STATIC_ROOT', None)
	media_root = getattr(settings, 'MEDIA_ROOT', None)

	if static_root:
		_wn = WhiteNoise(application, root=static_root)
	else:
		_wn = WhiteNoise(application)

	if media_root:
		_wn.add_files(media_root, prefix='media/')

	application = _wn
except Exception:
	# If WhiteNoise isn't available or something fails, fall back to the
	# unwrapped WSGI application. Errors will appear in logs during startup.
	pass
