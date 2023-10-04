from django.db import models
from django.contrib.auth.models import BaseUserManager


class UserManager(BaseUserManager, models.Manager):
    
    def _create_user(self, first_name, last_name, phone, rfc, bank, bank_card, bank_account, bank_clabe, terms, email, date_joined, password, is_staff, is_superuser, is_active, **extra_fields):
        user = self.model(
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            rfc=rfc,
            bank=bank,
            bank_card=bank_card,
            bank_account=bank_account,
            bank_clabe=bank_clabe,
            terms=terms,
            email=email,
            date_joined=date_joined,
            is_staff=is_staff,
            is_superuser=is_superuser,
            is_active=is_active,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self.db)

        return user
    
    def _create_superuser(self, email, password, is_staff, is_superuser, is_active, **extra_fields):
        user = self.model(
            email=email,
            is_staff=is_staff,
            is_superuser=is_superuser,
            is_active=is_active,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self.db)

        return user

    def create_user(self, first_name, last_name, phone, rfc, bank, bank_card, bank_account, bank_clabe, terms, email, date_joined, password, **extra_fields):
        return self._create_user(first_name, last_name, phone, rfc, bank, bank_card, bank_account, bank_clabe, terms, email, date_joined, password, True, False, True, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        return self._create_superuser(email, password, True, True, True, **extra_fields)