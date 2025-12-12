"""
URL configuration for stream project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('portal.urls')),
    path('api/v1/threads/', include('threads.urls')),
    path('api/v1/community/', include('community.urls')),
    path('api/v1/notifications/', include('notifications.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    # In production (DEBUG=False) the app is expected to be served by a
    # static file server. For quick deployments (like Render) we can let
    # WhiteNoise serve uploaded media by registering the media directory
    # in the WSGI app (`stream.wsgi`). This works only when the runtime
    # filesystem contains the media files (Render's filesystem is ephemeral).
    try:
        from whitenoise import WhiteNoise

        # WhiteNoise serving is configured in stream.wsgi — no further
        # action required here. This block is intentionally lightweight
        # and will silently continue if WhiteNoise isn't available.
        pass
    except Exception:
        pass
