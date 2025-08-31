from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
import uuid
from .models import Officer, Violation, Profile

Officer = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Officer
        fields = ['id', 'name', 'email', 'phone_number', 'role', 'photo', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'id': {'read_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        phone_number = validated_data['phone_number']
        while True:
            generated_id = str(uuid.uuid4())[:6]
            if not Officer.objects.filter(id=generated_id).exists():
                validated_data['id'] = generated_id
                break
        
        user = Officer.objects.create_officer(password=password, **validated_data)
        profile = Profile.objects.create(user=user, phone_number=phone_number)
        return user





class ViolationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Violation
        fields = ['id', 'license_plate', 'offender_name', 'license_id', 'violation_type', 'location', 'violation_date', 'officer', 'evidence', 'fee_status']
        extra_kwargs = {"officer": {"read_only": True}}