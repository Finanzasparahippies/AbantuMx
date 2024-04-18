from django.contrib.auth.models import User
import random
import string

def code_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

def change_code():
    users = User.objects.all()
    for user in users:
        user.codigo = code_generator()
        user.save()
    return 'Códigos cambiados correctamente'

change_code()