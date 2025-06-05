#!/bin/bash

# Добавляем все изменения
git add .

# Создаем коммит с текущей датой и временем
git commit -m "Auto-update: $(date '+%Y-%m-%d %H:%M:%S')"

# Пушим изменения в main ветку
git push origin main 