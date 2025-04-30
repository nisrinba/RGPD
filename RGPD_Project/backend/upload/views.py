from .models import AnalysisResult, EntityStatistic
from .serializers import AnalysisResultSerializer, FileUploadSerializer
from .utils import analyze_and_anonymize  
import tempfile
from django.db.models import Sum, Avg
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework import generics, status
import tempfile
import os


class FileUploadView(generics.CreateAPIView):
    parser_classes = [MultiPartParser]
    serializer_class = FileUploadSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        file = serializer.validated_data['file']
        operator = serializer.validated_data.get('operator', 'mask')
        
        # Sauvegarde temporaire du fichier
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            for chunk in file.chunks():
                tmp.write(chunk)
            tmp_path = tmp.name
        
        try:
            # Analyse et anonymisation
            result = analyze_and_anonymize(tmp_path, operator)
            
            # Sauvegarde des résultats
            analysis = AnalysisResult.objects.create(
                file_name=file.name,
                file_size=file.size,
                original_text=result['original_text'],
                anonymized_text=result['anonymized_text'],
                analysis_status='completed',
                operator_type=operator
            )
            
            for entity in result['entities']:
                EntityStatistic.objects.create(
                    analysis=analysis,
                    entity_type=entity['entity'],
                    count=entity['count'],
                    percentage=entity['percentage']
                )
            
            return Response(AnalysisResultSerializer(analysis).data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        finally:
            os.unlink(tmp_path)

class AnalysisResultListView(generics.ListAPIView):
    queryset = AnalysisResult.objects.all().order_by('-analysis_date')
    serializer_class = AnalysisResultSerializer

class DashboardStatisticsView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        # Statistiques globales pour le dashboard
        total_analyses = AnalysisResult.objects.count()
        sensitive_data_count = EntityStatistic.objects.aggregate(total=Sum('count'))['total'] or 0
        
        # Dernières analyses
        recent_analyses = AnalysisResult.objects.all().order_by('-analysis_date')[:5]
        
        # Types de données sensibles
        entity_stats = EntityStatistic.objects.values('entity_type').annotate(
            total=Sum('count'),
            percentage=Avg('percentage')
        ).order_by('-total')
        
        return Response({
            'total_analyses': total_analyses,
            'sensitive_data_count': sensitive_data_count,
            'recent_analyses': AnalysisResultSerializer(recent_analyses, many=True).data,
            'entity_stats': list(entity_stats)
        })