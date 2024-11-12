# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import UserInfo, PreferredFood, Allergy, UserAccount, UnpreferredFood
from django.contrib.auth.hashers import make_password, check_password
import logging

logger = logging.getLogger(__name__)

class SignUpView(APIView):
   def post(self, request):
       try:
           print("전체 request.data:", request.data)  # 전체 요청 데이터 확인
           email = request.data.get('email')
           password = request.data.get('password')
           
           print("받은 이메일:", email)  # 이메일 값 확인
           print("받은 비밀번호:", password)  # 비밀번호 값 확인

           if not email or not password:
               print("누락된 필드 체크 - email:", bool(email), "password:", bool(password))
               return Response(
                   {'error': '이메일과 비밀번호를 모두 입력해주세요.'}, 
                   status=status.HTTP_400_BAD_REQUEST
               )

           # 이메일 중복 체크
           if UserAccount.objects.filter(email=email).exists():
               print(f"이메일 중복: {email}")
               return Response(
                   {'error': '이미 존재하는 이메일입니다'}, 
                   status=status.HTTP_400_BAD_REQUEST
               )

           # 비밀번호 해싱 및 사용자 생성
           hashed_password = make_password(password)
           user = UserAccount.objects.create(
               email=email,
               password=hashed_password
           )
           
           print(f"회원가입 성공: {email}")  # 성공 로그
           return Response({
               'message': '회원가입 성공',
               'user_id': user.id
           }, status=status.HTTP_201_CREATED)

       except Exception as e:
           print(f"회원가입 실패: {str(e)}")  # 에러 로그
           return Response(
               {'error': f'회원가입 실패: {str(e)}'}, 
               status=status.HTTP_500_INTERNAL_SERVER_ERROR
           )




class LoginView(APIView):
    def post(self, request):
        try:
            email = request.data.get('email')
            password = request.data.get('password')

            if not email or not password:
                return Response(
                    {'error': '이메일과 비밀번호를 모두 입력해주세요.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = UserAccount.objects.filter(email=email).first()
            if not user:
                return Response(
                    {'error': '존재하지 않는 이메일입니다.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not check_password(password, user.password):
                return Response(
                    {'error': '비밀번호가 일치하지 않습니다.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            return Response({
                'message': '로그인 성공',
                'user_id': user.id
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import UserInfo, Allergy, UserAccount

@csrf_exempt
@require_http_methods(["POST"])
def save_allergies(request):
    try:
        data = json.loads(request.body)
        allergies = data.get('allergies', [])
        
        # 임시로 첫 번째 사용자 사용 (실제로는 로그인된 사용자를 가져와야 함)
        user_account = UserAccount.objects.first()
        
        # 기존 알러지 정보 삭제
        Allergy.objects.filter(user_account=user_account).delete()
        
        # 새로운 알러지 정보 저장
        for allergy in allergies:
            Allergy.objects.create(
                user_account=user_account,
                user_name=user_account.email,  # 또는 다른 식별자
                allergy_name=allergy
            )
            
        return JsonResponse({
            'status': 'success',
            'message': '알러지 정보가 저장되었습니다.',
            'allergies': allergies
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'message': '잘못된 데이터 형식입니다.'
        }, status=400)
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)
    

# views.py
@csrf_exempt
@require_http_methods(["POST"])
def save_profile(request):
    try:
        data = json.loads(request.body)
        user_info = data.get('user_info', {})
        allergies = data.get('allergies', [])
        
        # 현재 로그인한 사용자 가져오기 (임시로 첫 번째 사용자)
        user_account = UserAccount.objects.first()
        
        # UserInfo 테이블에 저장
        user_info_obj, created = UserInfo.objects.update_or_create(
            user_account=user_account,
            defaults={
                'user_name': user_info.get('nickname', ''),
                'is_vegan': user_info.get('is_vegan', False),
                'gender': user_info.get('gender', 'M'),
                'random_name': user_info.get('random_name', False)
            }
        )
        
        # 기존 알러지 정보는 이미 save_allergies에서 저장됨
        
        return JsonResponse({
            'status': 'success',
            'message': '프로필이 성공적으로 저장되었습니다.',
            'data': {
                'user_info': {
                    'nickname': user_info_obj.user_name,
                    'is_vegan': user_info_obj.is_vegan,
                    'gender': user_info_obj.gender,
                    'random_name': user_info_obj.random_name
                }
            }
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'message': '잘못된 데이터 형식입니다.'
        }, status=400)
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)
    
@api_view(['POST'])
def save_preferred_foods(request):
    try:
        preferred_foods = request.data.get('preferred_foods', [])
        
        # 현재 로그인된 UserInfo를 가져오기
        try:
            # UserAccount에서 먼저 사용자를 찾고
            user_account = UserAccount.objects.first()  # 테스트를 위해 first() 사용
            if not user_account:
                return Response(
                    {'error': '사용자 계정을 찾을 수 없습니다.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # 해당 사용자의 UserInfo 찾기
            user_info = UserInfo.objects.get(user_account=user_account)
            if not user_info:
                return Response(
                    {'error': '사용자 정보를 찾을 수 없습니다.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # 기존 선호 음식 삭제
            PreferredFood.objects.filter(user_info=user_info).delete()
            
            # 새로운 선호 음식 저장
            for food in preferred_foods:
                PreferredFood.objects.create(
                    user_info=user_info,
                    user_name=user_info.user_name,
                    food_name=food['food_name']
                )
                
            return Response({
                'message': '선호하는 음식이 저장되었습니다.',
                'preferred_foods': preferred_foods
            }, status=status.HTTP_200_OK)

        except UserInfo.DoesNotExist:
            return Response(
                {'error': '사용자 정보를 찾을 수 없습니다.'},
                status=status.HTTP_404_NOT_FOUND
            )
            
    except Exception as e:
        print(f"에러 발생: {str(e)}")  # 서버 로그에 에러 출력
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
def save_unpreferred_foods(request):
    try:
        unpreferred_foods = request.data.get('unpreferred_foods', [])
        
        try:
            # UserAccount에서 첫 번째 사용자 찾기
            user_account = UserAccount.objects.first()
            if not user_account:
                return Response(
                    {'error': '사용자 계정을 찾을 수 없습니다.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # UserInfo 찾기
            user_info = UserInfo.objects.get(user_account=user_account)
            if not user_info:
                return Response(
                    {'error': '사용자 정보를 찾을 수 없습니다.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # 기존 비선호 음식 삭제
            UnpreferredFood.objects.filter(user_info=user_info).delete()
            
            # 새로운 비선호 음식 저장
            for food in unpreferred_foods:
                UnpreferredFood.objects.create(
                    user_info=user_info,
                    user_name=user_info.user_name,
                    food_name=food['food_name']
                )
                
            return Response({
                'message': '싫어하는 음식이 저장되었습니다.',
                'unpreferred_foods': unpreferred_foods
            }, status=status.HTTP_200_OK)

        except UserInfo.DoesNotExist:
            return Response(
                {'error': '사용자 정보를 찾을 수 없습니다.'},
                status=status.HTTP_404_NOT_FOUND
            )
            
    except Exception as e:
        print(f"에러 발생: {str(e)}")
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)