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


try:
	static_root = getattr(settings, 'STATIC_ROOT', None)
	media_root = getattr(settings, 'MEDIA_ROOT', None)

	if static_root:
		_wn = WhiteNoise(application, root=static_root)
	else:
		_wn = WhiteNoise(application)

	if media_root:
		_wn.add_files(media_root, prefix='media/')

	# Wrap WhiteNoise application with a small WSGI middleware that adds
	# Access-Control-Allow-Origin header for media/static file responses.
	# This ensures files served directly by WhiteNoise still include CORS
	# headers so browsers won't block them when loaded from another origin.
	class _CorsForMediaMiddleware:
		def __init__(self, app):
			self.app = app

		def __call__(self, environ, start_response):
			path = environ.get('PATH_INFO', '') or ''

			def _start_response(status, headers, exc_info=None):
				# Only add CORS header for static/media file responses
				if path.startswith('/media/') or path.startswith('/static/'):
					headers.append(('Access-Control-Allow-Origin', '*'))
					# Allow common methods, credentials if needed (can be tightened)
					headers.append(('Access-Control-Allow-Methods', 'GET, OPTIONS'))
					headers.append(('Access-Control-Allow-Headers', 'Content-Type'))
				return start_response(status, headers, exc_info)

			return self.app(environ, _start_response)

	application = _CorsForMediaMiddleware(_wn)
except Exception:
	# If WhiteNoise isn't available or something fails, fall back to the
	# unwrapped WSGI application. Errors will appear in logs during startup.
	pass