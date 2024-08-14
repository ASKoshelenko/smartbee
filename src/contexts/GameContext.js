// GameContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

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
    if (!user) return; // Проверка на наличие пользователя
    try {
      const response = await axios.get('/api/user-stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUserStats(response.data);
    } catch (error) {
      console.error('Ошибка при получении статистики пользователя:', error);
      showNotification('Не удалось загрузить статистику пользователя', 'error');
    }
  }, [user, showNotification]);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  const updateExperience = async (amount) => {
    if (!user) return; // Проверка на наличие пользователя
    try {
      const response = await axios.post('/api/user-stats/experience', { amount }, {
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
    if (!user) return; // Проверка на наличие пользователя
    try {
      const response = await axios.post('/api/user-stats/badge', { badgeId }, {
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
