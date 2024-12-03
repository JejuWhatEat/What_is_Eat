from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import UserInfo, PreferredFood, Allergy, UserAccount, UnpreferredFood, Food
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
import json
import os
from django.conf import settings
import logging
from .models import UserInfo, PreferredFood, UserAccount, FoodCategory
from .utils import FOOD_DATA  # food_data에서 FOOD_DATA로 변경
from .models import UserAnalytics
from .models import NutritionalInformation


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

            # email도 함께 반환하도록 수정
            return Response({
                'message': '로그인 성공',
                'user_id': user.id,
                'email': user.email  # 실제 DB에 저장된 이메일 추가
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

@api_view(['GET'])
def get_food_images(request):
    """음식 이미지와 정보를 반환하는 뷰"""
    try:
        import random
        request_type = request.GET.get('type', '')

        food_list = []
        for number in range(1, 143):
            food_info = next(
                ({"name": name, "data": data} for name, data in FOOD_DATA.items() 
                if data["number"] == number),
                None
            )
            
            if food_info and os.path.exists(os.path.join(settings.MEDIA_ROOT, f'food_images/image{number}.jpeg.jpg')):
                image_data = {
                    'id': number,
                    'original_id': number,  # 원본 ID 추가
                    'food_name': food_info["name"],
                    'category_id': food_info["data"]["category"],
                    'image_url': request.build_absolute_uri(f'/media/food_images/image{number}.jpeg.jpg'),
                    'category_name': dict(Food.CATEGORY_CHOICES)[food_info["data"]["category"]]
                }
                food_list.append(image_data)

        if request_type == 'preferred':
            # 랜덤으로 5개 선택하고 1-100 사이의 랜덤 ID 할당
            selected_images = random.sample(food_list, 5)
            random_numbers = random.sample(range(1, 101), 5)
            
            for img, rand_num in zip(selected_images, random_numbers):
                img['id'] = rand_num  # 랜덤 ID 할당
                
            return Response({
                'status': 'success',
                'total_count': len(selected_images),
                'images': selected_images
            })
        else:
            return Response({
                'status': 'success',
                'total_count': len(food_list),
                'images': food_list
            })

    except Exception as e:
        print(f"Error in get_food_images: {str(e)}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def save_unpreferred_foods(request):
    """비선호 음식을 저장하는 뷰"""
    print("=== save_unpreferred_foods 호출됨 ===")
    print("Request Data:", request.data)
    
    try:
        unpreferred_foods = request.data.get('unpreferred_foods', [])
        print("Unpreferred Foods:", unpreferred_foods)

        user_account = UserAccount.objects.first()
        if not user_account:
            return Response({'error': '사용자 계정을 찾을 수 없습니다.'}, status=status.HTTP_404_NOT_FOUND)

        user_info = UserInfo.objects.get(user_account=user_account)
        
        UnpreferredFood.objects.filter(user_info=user_info).delete()
        
        saved_foods = []
        for food_item in unpreferred_foods:
            food_name = food_item['food_name']
            print(f"Processing food: {food_name}")
            
            food_info = next(
                ({"name": name, "data": data} for name, data in FOOD_DATA.items() 
                if name == food_name),
                None
            )
            
            if food_info:
                print(f"Found food info: {food_info}")
                try:
                    new_food = UnpreferredFood.objects.create(
                        user_info=user_info,
                        user_name=user_info.user_name,
                        food_name=food_name,
                        food_number=food_info["data"]["number"],
                        category_id=food_info["data"]["category"]
                    )
                    saved_foods.append(food_name)
                    print(f"Saved food: {food_name}")
                except Exception as e:
                    print(f"Error saving {food_name}: {str(e)}")
            else:
                print(f"Could not find food info for: {food_name}")
        
        print(f"Total foods saved: {len(saved_foods)}")
        return Response({
            'status': 'success',
            'message': '싫어하는 음식이 저장되었습니다.',
            'saved_foods': saved_foods
        })

    except Exception as e:
        print(f"Error in save_unpreferred_foods: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def save_preferred_foods(request):
    """선호 음식을 저장하는 뷰"""
    print("=== save_preferred_foods 호출됨 ===")
    print("Request Data:", request.data)
    
    try:
        # 프론트엔드에서 보내는 형식으로 데이터 받기
        preferred_foods = request.data.get('preferred_foods', [])
        print("Preferred Foods:", preferred_foods)

        user_account = UserAccount.objects.first()
        if not user_account:
            return Response({'error': '사용자 계정을 찾을 수 없습니다.'}, status=status.HTTP_404_NOT_FOUND)

        user_info = UserInfo.objects.get(user_account=user_account)
        
        # 기존 선호 음식 삭제
        PreferredFood.objects.filter(user_info=user_info).delete()
        
        saved_foods = []
        for food_item in preferred_foods:
            food_name = food_item['food_name']
            print(f"Processing food: {food_name}")
            
            # FOOD_DATA에서 해당 음식 정보 찾기
            food_info = next(
                ({"name": name, "data": data} for name, data in FOOD_DATA.items() 
                if name == food_name),
                None
            )
            
            if food_info:
                print(f"Found food info: {food_info}")
                try:
                    new_food = PreferredFood.objects.create(
                        user_info=user_info,
                        user_name=user_info.user_name,
                        food_name=food_name,
                        food_number=food_info["data"]["number"],
                        category_id=food_info["data"]["category"]
                    )
                    saved_foods.append(food_name)
                    print(f"Saved food: {food_name}")
                except Exception as e:
                    print(f"Error saving {food_name}: {str(e)}")
            else:
                print(f"Could not find food info for: {food_name}")
        
        print(f"Total foods saved: {len(saved_foods)}")
        return Response({
            'status': 'success',
            'message': '선호하는 음식이 저장되었습니다.',
            'saved_foods': saved_foods
        })

    except Exception as e:
        print(f"Error in save_preferred_foods: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def update_dwell_time(request):
    print("\n=== update_dwell_time 함수 시작 ===")
    try:
        dwell_times = request.data.get('dwell_times', {})
        login_email = request.data.get('email')
        
        print(f"1. 이메일로 사용자 찾기: {login_email}")
        
        # UserAccount 찾기
        user_account = None
        for user in UserAccount.objects.all():
            if user.email.lower() == login_email.lower():
                user_account = user
                break

        if not user_account:
            return Response({
                'status': 'error',
                'message': '사용자를 찾을 수 없습니다.'
            }, status=status.HTTP_404_NOT_FOUND)

        print(f"2. 찾은 UserAccount: {user_account.email}")

        # UserInfo 가져오기 시도
        try:
            user_info = UserInfo.objects.get(user_account=user_account)
            print("3. UserInfo 찾음")
            preferred_foods = PreferredFood.objects.filter(user_info=user_info)
            unpreferred_foods = UnpreferredFood.objects.filter(user_info=user_info)
            
             # 이 부분을 수정
            analytics = UserAnalytics.objects.get_or_create(
                user_account=user_account,
                defaults={
                    'dwell_times': {},
                    'is_vegan': user_info.is_vegan,
                    'gender': user_info.gender,
                    'preferred_foods': ','.join(str(pf.food_number) for pf in preferred_foods),
                    'unpreferred_foods': ','.join(str(unpreferred_food.food_number) for unpreferred_food in unpreferred_foods)
                }
            )[0]
            
             # 이 부분도 수정
            analytics.is_vegan = user_info.is_vegan
            analytics.gender = user_info.gender
            analytics.preferred_foods = ','.join(str(pf.food_number) for pf in preferred_foods)
            analytics.unpreferred_foods = ','.join(str(unpreferred_food.food_number) for unpreferred_food in unpreferred_foods)
            
        except UserInfo.DoesNotExist:
            print("3. UserInfo 없음 - 기본 Analytics 생성")
            # UserInfo가 없어도 체류시간은 저장
            analytics = UserAnalytics.objects.get_or_create(
                user_account=user_account,
                defaults={
                    'dwell_times': {}
                }
            )[0]

        # 체류시간 업데이트
        print("4. 체류시간 업데이트 시작")
        current_times = analytics.dwell_times or {}
        for food_id, time_ms in dwell_times.items():
            food_id_str = str(food_id)
            if food_id_str in current_times:
                current_times[food_id_str] += int(time_ms)
            else:
                current_times[food_id_str] = int(time_ms)

        analytics.dwell_times = current_times
        analytics.save()
        print("5. 체류시간 저장 완료")

        return Response({
            'status': 'success',
            'message': '체류시간이 업데이트되었습니다.',
            'data': {
                'dwell_times': current_times
            }
        })

    except Exception as e:
        print(f"ERROR in update_dwell_time: {str(e)}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
def get_user_analytics(request, user_id):
    """사용자의 통합 분석 데이터를 조회하는 API"""
    try:
        # 사용자 분석 데이터 가져오기
        analytics = UserAnalytics.objects.get(user_account_id=user_id)
        
        return Response({
            'status': 'success',
            'data': {
                'user_id': user_id,
                'is_vegan': analytics.is_vegan,
                'gender': analytics.gender,
                'allergies': analytics.get_allergies_list(),
                'preferred_foods': analytics.get_preferred_foods_list(),
                'unpreferred_foods': analytics.get_unpreferred_foods_list(),
                'dwell_times': analytics.dwell_times
            }
        })
        
    except UserAnalytics.DoesNotExist:
        return Response({
            'status': 'error',
            'message': '사용자 분석 데이터를 찾을 수 없습니다.'
        }, status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        print(f"Error in get_user_analytics: {str(e)}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_nutrition_info(request, food_id):
    try:
        print(f"Requested food_id: {food_id}")
        nutrition_info = NutritionalInformation.objects.get(id=food_id)
        print(f"Retrieved nutrition info: {nutrition_info}")
        return Response({
            'status': 'success',
            'data': {
                'food_name': nutrition_info.food_name,
                'calories': nutrition_info.calories,
                'carbohydrates': nutrition_info.carbohydrates,
                'protein': nutrition_info.protein,
                'fat': nutrition_info.fat
            }
        })
    except NutritionalInformation.DoesNotExist:
        print(f"NutritionalInformation.DoesNotExist for food_id: {food_id}")
        return Response({
            'status': 'error',
            'message': '해당 음식 정보를 찾을 수 없습니다.'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Exception in get_nutrition_info: {str(e)}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)