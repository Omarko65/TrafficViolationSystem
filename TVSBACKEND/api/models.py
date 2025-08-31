from django.db import models
from django.contrib.auth.models import (AbstractBaseUser, PermissionsMixin, BaseUserManager)
import uuid
import random
import string


class OfficerManager(BaseUserManager):
    def create_officer(self, id, password, **extra_fields):
        if not id:
            raise ValueError()
        officer = self.model(id=id, **extra_fields)
        officer.set_password(password)
        officer.save()
        return officer
    
    def create_superuser(self, id, password):
        officer = self.create_officer(id=id, password=password)
        officer.is_superuser = True
        officer.is_staff = True
        officer.save()
        return officer
    
class Officer(AbstractBaseUser, PermissionsMixin):

    ROLE_CHOICES = [
        ("ADMIN", 'Admin'),
        ("OFFICER", 'Officer'),
    ]
    id = models.CharField(primary_key=True, max_length=6, unique=True, editable=False)
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(unique=True, null=False, blank=False)
    phone_number = models.CharField(max_length=20, unique=True, blank=True, null=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='Officer')
    is_staff = models.BooleanField(default=False)
    photo = models.ImageField(upload_to='images', null=True, blank=True)
    USERNAME_FIELD = 'id'

    objects = OfficerManager()

    def __str__(self):
        return f"{self.id} - {self.name} - {self.email}"




class Violation(models.Model):
    VIOLATION_CHOICES = [
        ("SPEEDING", 'Speeding'),
        ("RED LIGHT", 'Red Light'),
        ("U-TURN", 'U-Turn'),
        ("PARKING", 'Parking'),
    ]
    FEE_STATUS_CHOICES = [
        ("UNPAID", "Unpaid"),
        ("PAID", "Paid"),
    ]

    id = models.CharField(primary_key=True, max_length=7, unique=True, editable=False)
    license_plate = models.CharField(max_length=20, null=False, blank=False)
    offender_name = models.CharField(max_length=255, blank=False, null=False)
    license_id =  models.IntegerField(default=0, null=True, blank=True)  
    violation_type = models.CharField(max_length=50, choices=VIOLATION_CHOICES, default='Speeding')
    location = models.CharField(max_length=100, null=False, blank=False)
    violation_date=models.DateField(auto_now_add=True)
    evidence = models.ImageField(upload_to='images', null=True, blank=True)
    fee_status = models.CharField(max_length=10, choices=FEE_STATUS_CHOICES, default="UNPAID")
    officer = models.ForeignKey(Officer, on_delete=models.PROTECT, related_name="recorded_violations")


    def save(self, *args, **kwargs):
        if not self.id:
            while True:
                random_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
                if not Violation.objects.filter(id=random_id).exists():
                    self.id = random_id
                    break
        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.offender_name} - {self.violation_type}"



class Profile(models.Model):
    user=models.OneToOneField(Officer, on_delete=models.CASCADE,related_name="profile")
    phone_number=models.CharField(max_length=15)
    otp=models.CharField(max_length=100,null=True,blank=True)
    uid=models.CharField(default=f'{uuid.uuid4()}',max_length=200)
    mfa_secret=models.CharField(max_length=64, blank=True, null=True)
    mfa_enabled=models.BooleanField(default=False)