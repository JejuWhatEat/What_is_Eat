import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from konlpy.tag import Okt
import gym
from gym import spaces
import time
import threading

# 데이터 불러오기
data = pd.read_csv('jeju.csv')

# Okt 형태소 분석기 초기화
okt = Okt()

# 텍스트 전처리 함수 (형태소 단위로 분리)
def preprocess_text(text):
    tokens = okt.morphs(text, stem=True) if isinstance(text, str) else []
    return " ".join(tokens)

# 주요 재료와 특징을 결합하여 텍스트 피처 생성 후 전처리 적용
data['text_features'] = (data['주요재료'].fillna('') + ' ' + data['특징'].fillna('')).apply(preprocess_text)

# TF-IDF 벡터라이저 적용
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(data['text_features'])

# 특정 음식의 특징을 추출하여 결합하는 함수
def get_food_features(food_list):
    feature_text = []
    for food in food_list:
        food_data = data[data['음식명'] == food]
        if not food_data.empty:
            feature_text.append(food_data.iloc[0]['text_features'])
    return " ".join(feature_text)

# TF-IDF 기반 추천 함수
def recommend_food(user_likes, user_dislikes, weather, time, allergy_ingredients=[], vegan=0):
    like_features = get_food_features(user_likes)
    user_profile_text = " ".join(user_likes) + " " + like_features
    user_profile = preprocess_text(user_profile_text)
    user_tfidf = tfidf_vectorizer.transform([user_profile])
    
    similarity_scores = cosine_similarity(user_tfidf, tfidf_matrix).flatten()
    recommendations = []
    for i, score in enumerate(similarity_scores):
        food_name = data.loc[i, '음식명']
        food_time = data.loc[i, '추천시간대'] if '추천시간대' in data.columns else ""
        food_weather = data.loc[i, '추천날씨'] if '추천날씨' in data.columns else ""
        food_ingredients = str(data.loc[i, '주요재료']) + str(data.loc[i, '알러지']) if '주요재료' in data.columns and '알러지' in data.columns else ""
        food_features = data.loc[i, 'text_features'] if 'text_features' in data.columns else ""
        is_vegan = data.loc[i, '비건'] if '비건' in data.columns else 0

        if food_name in user_dislikes:
            continue
        if (time in food_time or not time) and (weather in food_weather or not weather):
            if not any(allergy in food_ingredients for allergy in allergy_ingredients):
                if vegan == 0 or (vegan == 1 and is_vegan == 1):
                    recommendations.append((food_name, score))

    recommendations = sorted(recommendations, key=lambda x: x[1], reverse=True)[:5]
    return [food[0] for food in recommendations]

# 강화학습 모델 정의
class PPOAgent(nn.Module):
    def __init__(self, num_inputs, num_actions):
        super(PPOAgent, self).__init__()
        self.policy = nn.Sequential(
            nn.Linear(num_inputs, 128),
            nn.ReLU(),
            nn.Linear(128, num_actions),
            nn.Softmax(dim=-1)
        )
        self.value = nn.Sequential(
            nn.Linear(num_inputs, 128),
            nn.ReLU(),
            nn.Linear(128, 1)
        )

    def forward(self, x):
        action_probs = self.policy(x)
        state_values = self.value(x)
        return action_probs, state_values
    
# 정책 업데이트 함수
def ppo_update(agent, optimizer, states, actions, rewards, old_log_probs=None, gamma=0.99, epsilon=0.2):
    for _ in range(10):  # 다중 업데이트
        action_probs, state_values = agent(states)
        dist = torch.distributions.Categorical(action_probs)
        new_log_probs = dist.log_prob(actions)
        advantages = rewards - state_values.detach()

        # old_log_probs가 None일 경우를 처리
        if old_log_probs is None:
            old_log_probs = new_log_probs.detach()
        
        ratios = torch.exp(new_log_probs - old_log_probs)
        surr1 = ratios * advantages
        surr2 = torch.clamp(ratios, 1 - epsilon, 1 + epsilon) * advantages
        policy_loss = -torch.min(surr1, surr2).mean()
        value_loss = (rewards - state_values).pow(2).mean()
        loss = policy_loss + 0.5 * value_loss
        optimizer.zero_grad()
        loss.backward(retain_graph=True)
        optimizer.step()



# 강화학습 환경 정의
class FoodRecommendationEnv(gym.Env):
    def __init__(self, recommended_foods):
        super(FoodRecommendationEnv, self).__init__()
        self.recommended_foods = recommended_foods
        self.num_foods = len(recommended_foods)
        self.observation_space = spaces.Box(low=0, high=1, shape=(self.num_foods,), dtype=np.float32)
        self.action_space = spaces.Discrete(self.num_foods)
        self.current_step = 0

    def reset(self):
        self.current_step = 0
        return self._get_observation()

    def _get_observation(self):
        return np.random.rand(self.num_foods)

    def step(self, action):
        stay_duration = np.random.uniform(0, 10)
        reward = 1 if stay_duration > 5 else -1
        self.current_step += 1
        done = self.current_step > 20
        obs = self._get_observation()
        return obs, reward, done, {}

# 사용자 상호작용 데이터를 저장할 리스트
user_interactions = []

def collect_user_data(action, success):
    """사용자가 추천 결과에 대한 반응을 저장합니다."""
    reward = 1 if success else -1  # 성공 시 보상 1, 실패 시 보상 -1
    user_interactions.append((action, reward))

# 주기적으로 강화학습 모델 업데이트
# async_update_model에서 env.reset()으로 초기 관찰값 설정
def async_update_model(agent, optimizer, update_interval=60):
    """비동기적으로 일정 시간마다 모델을 업데이트합니다."""
    while True:
        if user_interactions:  # 저장된 사용자 상호작용 데이터가 있는 경우
            states, actions, rewards = [], [], []
            
            for action, reward in user_interactions:
                state = torch.FloatTensor(env.reset()).unsqueeze(0)  # env.reset() 사용하여 초기 관찰값 설정
                states.append(state)
                actions.append(torch.tensor([action]))
                rewards.append(reward)
            
            states = torch.cat(states)
            actions = torch.cat(actions)
            rewards = torch.FloatTensor(rewards)
            
            # PPO 업데이트 수행
            ppo_update(agent, optimizer, states, actions, rewards, old_log_probs=None)
            
            # 상호작용 데이터 초기화
            user_interactions.clear()
        
        time.sleep(update_interval)  # 지정된 시간 대기 후 다음 업데이트

# 비동기 학습 스레드 시작


# 추천 음식 생성 및 환경 초기화
user_likes = ["쫄깃", "한식", "분식", "일식", "매콤"]
user_dislikes = ["오돌뼈", "삼겹살", "라면"]
weather = "흐림"
time = "저녁(18~21)"
allergy_ingredients = ["우유"]
vegan = 0
recommended_foods = recommend_food(user_likes, user_dislikes, weather, time, allergy_ingredients, vegan)
env = FoodRecommendationEnv(recommended_foods)
agent = PPOAgent(num_inputs=len(recommended_foods), num_actions=len(recommended_foods))
optimizer = optim.Adam(agent.parameters(), lr=3e-4)

update_thread = threading.Thread(target=async_update_model, args=(agent, optimizer, 60))
update_thread.start()

# 예시: 사용자 상호작용 수집
# 예를 들어 사용자가 추천된 음식을 클릭했을 때 데이터를 수집
collect_user_data(action=2, success=True)  # action 2번 선택, 성공적인 상호작용
collect_user_data(action=3, success=False)  # action 3번 선택, 실패한 상호작용

# 학습 루프 및 성과 지표 저장
num_episodes = 1000
gamma = 0.99
all_rewards = []
successful_episodes = 0
success_rates = []

for episode in range(num_episodes):
    states, actions, rewards, log_probs = [], [], [], []
    obs = env.reset()
    done = False
    episode_reward = 0
    episode_success = False
    
    while not done:
        obs_tensor = torch.FloatTensor(obs).unsqueeze(0)
        action_probs, state_value = agent(obs_tensor)
        dist = torch.distributions.Categorical(action_probs)
        action = dist.sample()
        
        log_prob = dist.log_prob(action)
        obs, reward, done, _ = env.step(action.item())
        
        episode_reward += reward
        states.append(obs_tensor)
        actions.append(action)
        rewards.append(reward)
        log_probs.append(log_prob)

        # 성공 조건 (보상 기준 설정)
        if reward > 0:
            episode_success = True
    
    all_rewards.append(episode_reward)
    if episode_success:
        successful_episodes += 1
    success_rates.append(successful_episodes / (episode + 1))

    states = torch.cat(states)
    actions = torch.cat(actions)
    rewards = torch.FloatTensor(rewards)
    log_probs = torch.cat(log_probs)
    
    discounted_rewards = []
    cumulative_reward = 0
    for reward in reversed(rewards):
        cumulative_reward = reward + gamma * cumulative_reward
        discounted_rewards.insert(0, cumulative_reward)
    discounted_rewards = torch.FloatTensor(discounted_rewards)
    
    ppo_update(agent, optimizer, states, actions, discounted_rewards, log_probs)

# 학습 완료 후 가중치 저장
torch.save(agent.state_dict(), 'ppo_agent_weights.pth')

# 성과 지표 시각화
plt.plot(all_rewards)
plt.xlabel('Episode')
plt.ylabel('Total Reward')
plt.title('Total Reward per Episode')
plt.show()

plt.plot(success_rates)
plt.xlabel('Episode')
plt.ylabel('Success Rate')
plt.title('Success Rate per Episode')
plt.show()

print("Training Completed and Model Saved")
