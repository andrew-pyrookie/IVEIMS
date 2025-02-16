from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

username = "Drew"
user = User.objects.get(username=username)  # Replace with your username
token, created = Token.objects.get_or_create(user=user)
print(token.key)  # Copy this token


# Key: Authorization
# Value: Token e1e0fffc19214c00a601ed63663a59df888cc4f2
