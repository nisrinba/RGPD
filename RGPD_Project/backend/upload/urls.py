from django.urls import path
from .views import DashboardStatsView, FileUploadView, AnalysisListView

urlpatterns = [
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('analyses/', AnalysisListView.as_view(), name='analysis-list'),
]