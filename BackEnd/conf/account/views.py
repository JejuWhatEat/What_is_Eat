from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import UserProfile, UserAllergy
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
def save_profile(request):
    try:
        logger.info(f"Received data: {request.data}")
        data = request.data
        allergies = data.get('allergies', [])

        if not data.get('nickname'):
            return Response({
                'status': 'error',
                'message': '닉네임을 입력해주세요.'
            }, status=status.HTTP_400_BAD_REQUEST)

        profile = UserProfile.objects.create(
            has_allergies=bool(allergies),
            is_vegan=data.get('is_vegan', False),
            gender=data.get('gender', ''),
            random_name_enabled=data.get('random_name_enabled', False),
            nickname=data.get('nickname')
        )

        for allergy in allergies:
            UserAllergy.objects.create(
                user_profile=profile,
                allergy_name=allergy
            )

        logger.info(f"Successfully saved profile for {profile.nickname}")
        return Response({
            'status': 'success',
            'message': '프로필이 저장되었습니다.',
            'data': {
                'id': profile.id,
                'nickname': profile.nickname,
                'allergies': allergies
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return Response({
            'status': 'error',
            'message': '서버 오류가 발생했습니다.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def save_allergies(request):
    try:
        data = request.data
        allergies = data.get('selectedAllergies', [])
        
        profile = UserProfile.objects.last()
        if not profile:
            return Response({
                'status': 'error',
                'message': '프로필을 찾을 수 없습니다.'
            }, status=status.HTTP_404_NOT_FOUND)

        # 기존 알러지 정보 삭제
        UserAllergy.objects.filter(user_profile=profile).delete()

        # 새 알러지 정보 저장
        for allergy in allergies:
            UserAllergy.objects.create(
                user_profile=profile,
                allergy_name=allergy
            )

        return Response({
            'status': 'success',
            'message': '알러지 정보가 저장되었습니다.',
            'data': {
                'allergies': allergies
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)