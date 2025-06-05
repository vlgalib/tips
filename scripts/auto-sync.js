const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Функция для получения статуса git
function getGitStatus() {
  try {
    return execSync('git status --porcelain').toString();
  } catch (error) {
    console.error('Ошибка при получении статуса git:', error);
    return '';
  }
}

// Функция для проверки изменений
function hasChanges() {
  const status = getGitStatus();
  return status.length > 0;
}

// Функция для создания коммита
function createCommit() {
  const timestamp = new Date().toISOString();
  const commitMessage = `Auto-sync: ${timestamp}`;
  
  try {
    execSync('git add .');
    execSync(`git commit -m "${commitMessage}"`);
    console.log('✅ Коммит создан успешно');
    return true;
  } catch (error) {
    console.error('❌ Ошибка при создании коммита:', error);
    return false;
  }
}

// Функция для отправки изменений
function pushChanges() {
  try {
    execSync('git push origin main');
    console.log('✅ Изменения отправлены успешно');
    return true;
  } catch (error) {
    console.error('❌ Ошибка при отправке изменений:', error);
    return false;
  }
}

// Функция для проверки конфликтов
function checkConflicts() {
  try {
    const status = execSync('git status').toString();
    return status.includes('conflict');
  } catch (error) {
    console.error('Ошибка при проверке конфликтов:', error);
    return false;
  }
}

// Основная функция синхронизации
function sync() {
  console.log('🔄 Начало синхронизации...');

  if (!hasChanges()) {
    console.log('📌 Нет изменений для синхронизации');
    return;
  }

  if (checkConflicts()) {
    console.error('⚠️ Обнаружены конфликты! Требуется ручное разрешение.');
    return;
  }

  if (createCommit()) {
    pushChanges();
  }

  console.log('✨ Синхронизация завершена');
}

// Запуск синхронизации
sync(); 