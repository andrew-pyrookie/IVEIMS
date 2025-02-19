from rest_framework.authtoken.models import Token
from api.models import Users

user = Users.objects.first()  # Select an existing user
token, created = Token.objects.get_or_create(user=user)
print(token.key)

#WWW-Authenticate: Token
# Token: e1e0fffc19214c00a601ed63663a59df888cc4f2