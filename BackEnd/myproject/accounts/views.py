from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import SignUpSerializer

@api_view(['POST'])
def signup(request):
    serializer = SignUpSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': '회원가입이 완료되었습니다.'
        }, status=status.HTTP_201_CREATED)
    return Response({
        'message': '유효하지 않은 데이터입니다.',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)
