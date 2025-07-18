from django.shortcuts import render
from rest_framework.views import APIView
import datetime as dt
import random
import pyotp
import io
import qrcode
import base64
from rest_framework import generics
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import (AllowAny, IsAuthenticated)
from django.db.models import Q, Count
from .serializers import RegisterSerializer, ViolationSerializer
from .models import Officer, Violation, Profile
from .mixins import MessageHandler
from .utils import mask_phone



def verify_2fa_otp(user, otp):
    totp=pyotp.TOTP(user.mfa_secret)
    if totp.verify(otp):
        user.mfa_enabled=True
        user.save()
        return True
    return False
'''
User Views => Create user view
'''

class CreateUserView(generics.CreateAPIView):
    queryset = Officer.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
        

class GetCurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        officer=Profile.objects.get(user=user)
        serializer = RegisterSerializer(user)
        data = serializer.data.copy()
        data['mfa_enabled'] = officer.mfa_enabled
        return Response(data)
    

@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated]) 
def update_officer(request):
    try:
        user = request.user
        officer_id = request.data.get("officer_id")

        if user.id != officer_id:
            raise NotFound("Invalid ID")
        
        officer = Officer.objects.get(id=officer_id)
        profile = Profile.objects.get(user=officer)
        
    except Officer.DoesNotExist:
        print("Officer not found")
        raise NotFound("Officer not found")

    serializer = RegisterSerializer(officer, data=request.data, partial=True)
    phone_number = request.data.get("phone_number")
    if phone_number:
        profile.phone_number=phone_number
        profile.save()

    if serializer.is_valid():
        serializer.save()
        return Response({"detail": "Officer updated successfully", "data": serializer.data}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["POST"])
@permission_classes([AllowAny])
def otp_login(request):
    phone_number = request.data.get("phone_number")
    phone = "+234" + phone_number[1:]
    if not phone_number:
        return Response({"detail": "phone_number is required"},
                        status=status.HTTP_400_BAD_REQUEST)
    
    try:
        profile = Profile.objects.get(phone_number=phone_number)
    except Profile.DoesNotExist:
        raise NotFound("Phone number not found")
    
    profile.otp = random.randint(1000, 9999)
    profile.save(update_fields=["otp"])
    print(profile.uid)
    message_handler = MessageHandler(phone, profile.otp).send_otp_on_phone()

    masked = mask_phone(phone_number)

    return Response(
        {"detail": f"OTP sent to {masked}", "uid": profile.uid},
        status=status.HTTP_200_OK
    )

@api_view(['POST'])
@permission_classes([AllowAny])
def otp_verify(request):
    uid = request.data.get("uid")
    try:
        profile = Profile.objects.get(uid=uid)
    except Profile.DoesNotExist:
        print("Uid Not found")
        raise NotFound("User not found")
       
    submitted = request.data.get("otp")
    if request.method=="POST":
        profile=Profile.objects.get(uid=uid)
        print("UUid Not found")
        if str(profile.otp) == str(submitted):
            return Response({"detail": "OTP verification success"},
                        status=status.HTTP_200_OK)
        
        return Response({"detail": "Wrong OTP"},
                    status=status.HTTP_400_BAD_REQUEST)
    



@api_view(['GET', 'POST']) 
@permission_classes([IsAuthenticated])
def mfa_login(request):
    officer = request.user
    user=Profile.objects.get(user=officer)
    if not user.mfa_secret:
        user.mfa_secret=pyotp.random_base32()
        user.save()
    otp_url = pyotp.totp.TOTP(user.mfa_secret).provisioning_uri(
        name=officer.email,
        issuer_name=officer.name
    )
    qr = qrcode.make(otp_url)
    buffer = io.BytesIO()
    qr.save(buffer, format="PNG")

    buffer.seek(0)
    qr_code = base64.b64encode(buffer.getvalue()).decode("utf-8")

    qr_code_data_url = f"data:image/png;base64,{qr_code}"
    return Response({"qrcode": qr_code_data_url},
                        status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_mfa(request):
    otp = request.data.get('otp_code')
    id = request.data.get('officer_id')
    officer = Officer.objects.get(id=id)
    user=Profile.objects.get(user=officer)
    if verify_2fa_otp(user, otp):
        return Response({"qrcode":"MFA verified successfully!"},
                        status=status.HTTP_200_OK)
    return Response({"detail": "Wrong OTP"},
                    status=status.HTTP_400_BAD_REQUEST)
    

'''
Violations Views => Create new violation
'''

class ViolationListCreate(generics.ListCreateAPIView):
    serializer_class = ViolationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Violation.objects.filter(officer=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(officer=self.request.user)
        else:
            print(serializer.errors)


class ViolationRetrieveUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Violation.objects.all()
    serializer_class = ViolationSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'


class ViolationSmartSearch(generics.ListAPIView):
    serializer_class = ViolationSerializer

    def get_queryset(self):
        term = self.kwargs["term"]

        if term.isdigit():
            qs = Violation.objects.filter(license_id=int(term))
        else:                                           
            qs = Violation.objects.filter(offender_name__icontains=term)

        if not qs.exists():
            raise NotFound(f"No violations found for “{term}”")
        
        return qs.order_by("-violation_date", "-id")



class ViolationReportView(APIView):
    DATE_FMT = "%Y-%m-%d"

    def get(self, request, start_date, end_date, *args, **kwargs):
        try:
            start = dt.datetime.strptime(start_date, self.DATE_FMT).date()
            end   = dt.datetime.strptime(end_date,   self.DATE_FMT).date()
        except ValueError:
            raise ValidationError("Dates must be in YYYY-MM-DD format.")

        if start > end:
            raise ValidationError("start_date cannot be after end_date.")

        qs = (
            Violation.objects
            .filter(violation_date__range=(start, end))
            .order_by("-violation_date", "-id")      # newest first
        )

        data = ViolationSerializer(qs, many=True, context={"request": request}).data
        return Response(data, status=status.HTTP_200_OK)
    

@api_view(["GET"])
@permission_classes([IsAuthenticated]) 
def violation_stats(request):
    allofficers = ""
    most_common_violation = (
        Violation.objects
        .values('violation_type')
        .annotate(count=Count('violation_type'))
        .order_by('-count')
        .first()
    )
    if most_common_violation['violation_type']:
        commonviolation = most_common_violation['violation_type']
    else:
        commonviolation="None"

    fee_status_counts = (
        Violation.objects
        .values('fee_status')
        .annotate(count=Count('fee_status'))
    )

    paid_count=0

    for fee in fee_status_counts:
        if fee['fee_status'] == "PAID":
            paid_count = fee['count']

    violations = Violation.objects.all()
    violation_data = ViolationSerializer(violations, many=True).data
    allviolations = len(violation_data)

    return Response({
        "violation_stats": commonviolation,
        "fee_stats": paid_count,
        "violations": allviolations,
    })

class ViolationDelete(generics.DestroyAPIView):
    queryset = Violation.objects.all()
    serializer_class = ViolationSerializer
    permission_classes = [IsAuthenticated]