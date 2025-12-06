from .models import Notification
from portal.models import UserFollow

def create_like_notification(thread, user):
    
    '''
    Create notification when someone likes a thread
    Only notifies if the liker is not the thread author
    '''
    
    if thread.author != user:
        user_name = f"{user.profile.firstname} {user.profile.lastname}" if hasattr(user, 'profile') else user.username
        Notification.objects.create(
            recipient=thread.author,
            sender=user,
            notification_type='like',
            thread=thread,
            message=f'{user_name} liked your thread "{thread.title}"'
        )


def create_comment_notification(comment, thread, user):
    
    '''
    Create notification when someone comments on a thread
    Only notifies if the commenter is not the thread author
    '''
    
    if thread.author != user:
        user_name = f"{user.profile.firstname} {user.profile.lastname}" if hasattr(user, 'profile') else user.username
        Notification.objects.create(
            recipient=thread.author,
            sender=user,
            notification_type='comment',
            thread=thread,
            comment=comment,
            message=f'{user_name} commented on your thread post "{thread.title}"'
        )


def create_follow_notification(follower, following):
    
    '''
    Create notification when someone follows a user
    '''
    
    follower_name = f"{follower.profile.firstname} {follower.profile.lastname}" if hasattr(follower, 'profile') else follower.username
    Notification.objects.create(
        recipient=following,
        sender=follower,
        notification_type='follow',
        message=f'{follower_name} started following you'
    )


def create_new_post_notification(thread, author):
    
    '''
    Create notification for followers when user creates a new post
    Uses bulk_create for better performance when notifying multiple followers
    '''
    
    followers = UserFollow.objects.filter(following=author).select_related('follower')
    
    author_name = f"{author.profile.firstname} {author.profile.lastname}" if hasattr(author, 'profile') else author.username
    
    notifications = []
    for follow in followers:
        notifications.append(
            Notification(
                recipient=follow.follower,
                sender=author,
                notification_type='new_post',
                thread=thread,
                message=f'{author_name} posted a new thread: "{thread.title}"'
            )
        )
    
    if notifications:
        Notification.objects.bulk_create(notifications)
