import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Настройка для игнорирования трансформации axios
jest.mock('axios');

// Настройка для обработки CSS модулей
jest.mock('*.module.css', () => ({}));

// Настройка тестового окружения
configure({ testIdAttribute: 'data-testid' });

// Подавление предупреждений консоли во время тестов
console.error = jest.fn();
console.warn = jest.fn();