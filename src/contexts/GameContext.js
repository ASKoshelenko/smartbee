import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { API_BASE_URL } from '../config';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [userStats, setUserStats] = useState({
    level: 1,
    experience: 0,
    badges: [],
    streakDays: 0
  });
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const fetchUserStats = useCallback(async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/user-stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUserStats(response.data);
    } catch (error) {
      console.error('Ошибка при получении статистики пользователя:', error);
      showNotification('Не удалось загрузить статистику пользователя', 'error');
    }
  }, [user, showNotification]);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user, fetchUserStats]);

  const updateExperience = async (amount) => {
    if (!user) return;
    try {
      const response = await axios.post(`${API_BASE_URL}/user-stats/experience`, { amount }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUserStats(response.data);
      if (response.data.level > userStats.level) {
        showNotification(`Поздравляем! Вы достигли уровня ${response.data.level}!`, 'success');
      }
    } catch (error) {
      console.error('Ошибка при обновлении опыта:', error);
      showNotification('Не удалось обновить опыт', 'error');
    }
  };

  const awardBadge = async (badgeId) => {
    if (!user) return;
    try {
      const response = await axios.post(`${API_BASE_URL}/user-stats/badge`, { badgeId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUserStats(response.data);
      showNotification(`Вы заработали новый значок: ${badgeId}!`, 'success');
    } catch (error) {
      console.error('Ошибка при присуждении значка:', error);
      showNotification('Не удалось присудить значок', 'error');
    }
  };

  return (
    <GameContext.Provider value={{ userStats, updateExperience, awardBadge }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);