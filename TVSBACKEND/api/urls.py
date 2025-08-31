from django.urls import path
from rest_framework.authtoken import views
from . import views


urlpatterns = [
    path('violations/', views.ViolationListCreate.as_view(), name="violation-list"),
    path("violations/<str:id>/", views.ViolationRetrieveUpdateView.as_view(), name="violation-retrieve-update"),
    path("violations/report/<str:start_date>/<str:end_date>/", views.ViolationReportView.as_view(), name="violation-report"),
    path("user/", views.GetCurrentUserView.as_view(), name="get-current-user"),
    path("violations/search/<str:term>/", views.ViolationSmartSearch.as_view(), name="violations-smart-search"),
    path("violations/delete/<int:pk>/", views.ViolationDelete.as_view(), name="violation-delete"),
    path('adminstats/', views.violation_stats, name='adminstats'),
    path('otplogin/', views.otp_login, name='otplogin'),
    path('otpverify/', views.otp_verify, name='otpverify'),
    path('officer/update/', views.update_officer, name='update_officer'),
    path('mfalogin/', views.mfa_login, name='mfalogin'),
    path('mfaverify/', views.verify_mfa, name='mfaverify'),
    path('faceid/', views.face_id, name='faceid'),
]
