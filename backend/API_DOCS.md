![Static Badge](https://img.shields.io/badge/Community_Forum_App-yellow?style=for-the-badge)
![Static Badge](https://img.shields.io/badge/SNSU-gree?style=for-the-badge)
![Static Badge](https://img.shields.io/badge/stream-black?style=for-the-badge&logo=android)
![Static Badge](https://img.shields.io/badge/django-black?style=for-the-badge&logo=django&logoColor=%231DA456)
![Static Badge](https://img.shields.io/badge/ionic-black?style=for-the-badge&logo=ionic)
![Static Badge](https://img.shields.io/badge/react-black?style=for-the-badge&logo=react)


# Stream - SNSU Community Forum App

This document describes the backend REST API (Django + DRF) used by the SNSU Community Forum App.

Base URL (development):

- http://localhost:8000/api/v1/

Authentication
--------------
- This API uses JWT (access + refresh tokens) for authentication for most endpoints.
- Obtain tokens: POST to `auth/signin/` (see below). Use the returned access token in the Authorization header:

- Header: Authorization: Bearer <access_token>

Content types
-------------
- JSON requests: Content-Type: application/json
- File uploads (profile image, thread/community post image): multipart/form-data

Common error responses
----------------------
- 400 Bad Request — validation or missing fields
- 401 Unauthorized — missing/invalid token
- 403 Forbidden — insufficient permissions
- 404 Not Found — resource not found

Authentication & User endpoints (portal)
----------------------------------------

Prefix: `auth/`

- POST `signup/` (AllowAny)
	- Description: Register a new user. Expects form/multipart data.
	- Body (multipart/form-data):
		- username (string)
		- email (string) — must end with `@ssct.edu.ph`
		- password (string)
		- confirm_password (string)
		- profile (string) — JSON string with required fields: firstname, lastname, birth_date (YYYY-MM-DD), gender, role, department, course
	- Response 201:
		{
			"message": "User signup successfully",
			"username": "...",
			"email": "..."
		}
	- Notes: New users are created with is_active=False and an OTP is sent for verification.

- POST `signup/verify/` (AllowAny)
	- Description: Verify signup OTP sent to user email.
	- Body (application/json): { "username": "...", "otp_code": "123456" }
	- Response 200: { "message": "Verification successful. Account activated." }

- POST `signup/resend/` (AllowAny)
	- Description: Resend verification OTP for username.
	- Body: { "username": "..." }

- POST `signin/` (AllowAny)
	- Description: Obtain JWT tokens.
	- Body: { "username": "...", "password": "..." }
	- Uses: `rest_framework_simplejwt.views.TokenObtainPairView`
	- Response: access & refresh tokens (standard Simple JWT response)

- POST `token/refresh/` (AllowAny)
	- Description: Refresh access token using refresh token.

- GET `profile/` (Authenticated)
	- Description: Retrieve authenticated user's profile details.
	- Response: serialized `UserProfileDetailSerializer` containing fields such as username, email, firstname, lastname, profile_image_url, role, department, followers_count, following_count, can_update_profile, etc.

- PATCH `profile/details/` (Authenticated)
	- Description: Update profile details (username, firstname, lastname, birth_date, gender, role, department, course).
	- Note: Profile updates are rate-limited (once every 7 days). Returns updated profile on success.

- PATCH `profile/password/` (Authenticated)
	- Description: Update password. Body: { "old_password": "...", "new_password": "...", "confirm_password": "..." }
	- Note: Password change cooldown (~14 days) enforced via profile.

- PATCH `profile/image/` (Authenticated, multipart)
	- Description: Update profile image. Field: profile_image (file)
	- Response includes updated profile with `profile_image_url`.

- POST `follow/<username>/` (Authenticated)
	- Description: Follow a user. Returns follower/following counts.
	- Response 201: { message, is_following: true, followers_count, following_count }

- DELETE `follow/<username>/` (Authenticated)
	- Description: Unfollow a user.

- GET `followers/<username>/` (Authenticated)
	- Description: List followers for a user. Returns count and `UserFollowSerializer` list.

- GET `following/<username>/` (Authenticated)
	- Description: List users followed by a user.

- GET `users/` (Authenticated)
	- Description: List all users (excluding superusers and current user) with brief profile information and whether current user is following them.

Threads endpoints
-----------------

Prefix: `threads/`

- GET `posts/` (Authenticated)
	- Description: List all thread posts. Returns serialized `ThreadPostSerializer` with fields such as id, author, title, content, image, likes_count, is_liked, comments_count.

- GET `my-posts/` (Authenticated)
	- Description: List thread posts by the authenticated user.

- POST `create/` (Authenticated, multipart)
	- Description: Create a new thread post. Body (multipart or form): title, content, image (optional), thread_type
	- Response 201: { message: 'Thread post created!', thread: <ThreadPost> }

- GET `posts/<int:pk>/` (Authenticated)
	- Description: Retrieve thread post details.

- PUT `posts/<int:pk>/` (Authenticated)
	- Description: Update thread post (only owner allowed). Body: title, content, image, thread_type

- DELETE `posts/<int:pk>/` (Authenticated)
	- Description: Delete thread post (only owner allowed).

- GET `posts/<int:pk>/comments/` (Authenticated)
	- Description: Get comments for a thread post. Returns list of `ThreadCommentSerializer` entries.

- POST `posts/<int:pk>/comments/` (Authenticated)
	- Description: Create a comment for a thread post. Body: { "content": "..." }
	- Response 201: Created comment data.

- POST `posts/<int:pk>/like/` (Authenticated)
	- Description: Toggle like/unlike for the authenticated user on the thread post. Response indicates message, likes_count and is_liked boolean.

Community (groups) endpoints
---------------------------

Prefix: `community/`

- GET `groups/` (Authenticated)
	- List public/active community groups. Returns `CommunityGroupSerializer` items (includes `is_member` and `user_role`).

- POST `groups/create/` (Authenticated, multipart) — Admin only
	- Create a community group. Body: name, description, image (optional), is_private (boolean).

- GET `groups/<int:pk>/` (Authenticated)
	- Retrieve details about a community group.

- PUT `groups/<int:pk>/` (Authenticated) — Superuser only
	- Update a community group.

- DELETE `groups/<int:pk>/` (Authenticated) — Superuser only
	- Soft-delete (sets is_active=False) a community group.

- GET `groups/my-communities/` (Authenticated)
	- List communities the authenticated user is a member of.

Membership management
---------------------

- POST `groups/<int:pk>/join/` (Authenticated)
	- Join a community. Creates membership with role='member'.

- DELETE `groups/<int:pk>/join/` (Authenticated)
	- Leave a community. Prevents last admin from leaving.

- GET `groups/<int:pk>/members/` (Authenticated)
	- List members of a community. For private communities, only members may list members.

- PUT `groups/<int:pk>/members/<int:member_id>/role/` (Authenticated)
	- Update a member's role (member/moderator/admin). Only admins or superuser allowed.

Community posts
---------------

- GET `groups/<int:pk>/posts/` (Authenticated)
	- List posts in a community. Only community members can view.

- POST `posts/create/` (Authenticated, multipart)
	- Create a community post. Body: community (id), title, content, image (optional). Only community members can create posts.

- GET `posts/<int:pk>/` (Authenticated)
	- Get community post details. Only members of the associated community can view.

- PUT `posts/<int:pk>/` (Authenticated)
	- Update a community post. Allowed to post author, or community moderator/admin.

- DELETE `posts/<int:pk>/` (Authenticated)
	- Delete a community post. Allowed to post author, or community moderator/admin.

Notifications endpoints
-----------------------

Prefix: `notifications/`

- GET `content/` (Authenticated)
	- List notifications for authenticated user. Returns `NotificationSerializer` with sender info, notification_type, thread references, message, is_read.

- POST/PUT `content/<int:pk>/read/` (Authenticated)
	- Mark a single notification as read (endpoint: `content/<pk>/read/` uses a view to mark as read).

- POST/PUT `content/read-all/` (Authenticated)
	- Mark all notifications as read.

- DELETE `content/<int:pk>/delete/` (Authenticated)
	- Delete a single notification.

Examples
--------

1) Create a thread post (multipart/form-data)

Headers:
- Authorization: Bearer <access_token>
- Content-Type: multipart/form-data

Form fields:
- title: "My first thread"
- content: "This is the body of the thread..."
- thread_type: "general"
- image: (file)

Response (201):
{
	"message": "Thread post created!",
	"thread": { ... ThreadPostSerializer ... }
}

2) Follow a user

POST `auth/follow/alice/` -> Response 201 with followers_count and following_count.

Notes & implementation details
------------------------------
- File fields (profile_image, community image, thread image) are served via Django MEDIA settings during DEBUG. In production, configure a proper media store and CDN.
- Several endpoints enforce cooldowns or role checks in views (profile updates, password change, community admin-only actions).
- OTP verification uses an internal `UserOTP` model and TOTP via pyotp. Signup requires verifying OTP to activate account.
- Serializers and views include helpful computed fields (e.g., is_liked, is_member, can_edit) which adapt responses based on the requesting user.

Where to look in codebase
-------------------------
- URL routing root: `backend/stream/urls.py`
- Auth & profile: `backend/portal/` (views + serializers + models)
- Threads: `backend/threads/` (views + serializers + models)
- Community groups: `backend/community/` (views + serializers + models)
- Notifications: `backend/notifications/` (views + serializers + models)

