from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import UserInfo, PreferredFood, Allergy, UserAccount, UnpreferredFood, Food  # Food 추가
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
import json
import os
from django.conf import settings
import logging
from .models import UserInfo, PreferredFood, UserAccount, FoodCategory  # FoodCategory 추가
from .utils import FOOD_DATA as food_data  # food_data import 추가

logger = logging.getLogger(__name__)

class SignUpView(APIView):
   def post(self, request):
       try:
           print("전체 request.data:", request.data)
           email = request.data.get('email')
           password = request.data.get('password')
           
           if not email or not password:
               return Response(
                   {'error': '이메일과 비밀번호를 모두 입력해주세요.'}, 
                   status=status.HTTP_400_BAD_REQUEST
               )

           if UserAccount.objects.filter(email=email).exists():
               return Response(
                   {'error': '이미 존재하는 이메일입니다'}, 
                   status=status.HTTP_400_BAD_REQUEST
               )

           hashed_password = make_password(password)
           user = UserAccount.objects.create(
               email=email,
               password=hashed_password
           )
           
           return Response({
               'message': '회원가입 성공',
               'user_id': user.id
           }, status=status.HTTP_201_CREATED)

       except Exception as e:
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

@csrf_exempt
@require_http_methods(["POST"])
def save_allergies(request):
    try:
        data = json.loads(request.body)
        allergies = data.get('allergies', [])
        
        user_account = UserAccount.objects.first()
        
        Allergy.objects.filter(user_account=user_account).delete()
        
        for allergy in allergies:
            Allergy.objects.create(
                user_account=user_account,
                user_name=user_account.email,
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

@csrf_exempt
@require_http_methods(["POST"])
def save_profile(request):
    try:
        data = json.loads(request.body)
        user_info = data.get('user_info', {})
        
        user_account = UserAccount.objects.first()
        
        user_info_obj, created = UserInfo.objects.update_or_create(
            user_account=user_account,
            defaults={
                'user_name': user_info.get('nickname', ''),
                'is_vegan': user_info.get('is_vegan', False),
                'gender': user_info.get('gender', 'M'),
                'random_name': user_info.get('random_name', False)
            }
        )
        
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
        
        try:
            user_account = UserAccount.objects.first()
            if not user_account:
                return Response(
                    {'error': '사용자 계정을 찾을 수 없습니다.'},
                    status=status.HTTP_404_NOT_FOUND
                )

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
                food_name = food['food_name']
                if food_name in food_data:
                    data = food_data[food_name]
                    category = FoodCategory.objects.get(category_id=data["category"])
                    
                    PreferredFood.objects.create(
                        user_info=user_info,
                        user_name=user_info.user_name,
                        food_name=food_name,
                        food_number=data["number"],
                        category=category
                    )
                    print(f"저장된 음식: {food_name}, 번호: {data['number']}, 카테고리: {data['category']}")
                else:
                    print(f"음식을 찾을 수 없음: {food_name}")
                
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
        print(f"에러 발생: {str(e)}")
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def save_unpreferred_foods(request):
    try:
        unpreferred_foods = request.data.get('unpreferred_foods', [])
        
        try:
            user_account = UserAccount.objects.first()
            if not user_account:
                return Response(
                    {'error': '사용자 계정을 찾을 수 없습니다.'},
                    status=status.HTTP_404_NOT_FOUND
                )

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
                food_name = food['food_name']
                if food_name in food_data:
                    data = food_data[food_name]
                    category = FoodCategory.objects.get(category_id=data["category"])
                    
                    UnpreferredFood.objects.create(
                        user_info=user_info,
                        user_name=user_info.user_name,
                        food_name=food_name,
                        food_number=data["number"],
                        category=category
                    )
                    print(f"저장된 음식: {food_name}, 번호: {data['number']}, 카테고리: {data['category']}")
                else:
                    print(f"음식을 찾을 수 없음: {food_name}")
                
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

@api_view(['GET'])
def get_food_images(request):
   try:
       food_type = request.query_params.get('type', 'preferred')
       
       # 디버깅을 위한 로그
       print(f"요청된 food_type: {food_type}")
       
       # Food 모델에서 모든 음식 데이터 가져오기
       foods = Food.objects.all()
       print(f"전체 음식 데이터 수: {foods.count()}")

       # 이미지 디렉토리 확인
       images_dir = os.path.join(settings.MEDIA_ROOT, 'food_images')
       print(f"이미지 디렉토리: {images_dir}")
       print(f"디렉토리 존재 여부: {os.path.exists(images_dir)}")
       if os.path.exists(images_dir):
           print(f"디렉토리 내용: {os.listdir(images_dir)}")

       base_url = request.build_absolute_uri(settings.MEDIA_URL)
       print(f"기본 URL: {base_url}")

       food_list = []
       for food in foods:
           image_path = f'food_images/image{food.image_number}.jpeg'
           full_path = os.path.join(settings.MEDIA_ROOT, image_path)
           
           print(f"처리 중인 음식: {food.name}")
           print(f"이미지 번호: {food.image_number}")
           print(f"카테고리: {food.get_category_display()}")
           print(f"이미지 경로: {full_path}")
           print(f"이미지 존재 여부: {os.path.exists(full_path)}")

           # 이미지가 없어도 데이터는 전송 (개발 중에는 이미지가 없어도 됨)
           food_list.append({
               'id': food.image_number,
               'food_name': food.name,
               'category_id': food.category,
               'image_url': f'{base_url}{image_path}',
               'category_name': food.get_category_display()
           })

       print(f"전체 응답 데이터 수: {len(food_list)}")

       return Response({
           'status': 'success',
           'total_count': len(food_list),
           'images': food_list
       })

   except Exception as e:
       print(f"에러 발생: {str(e)}")
       import traceback
       print(f"상세 에러: {traceback.format_exc()}")
       return Response({
           'status': 'error',
           'message': str(e),
           'detail': traceback.format_exc()
       }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)