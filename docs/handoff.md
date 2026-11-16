# Задания из чата проекта WorkChat Seattle

## Задание 16.11.2026
1. Прочитай `docs/after-launch-updates.md`.
2. Добавь в `CLAUDE.md` короткий раздел «После запуска» со ссылкой на этот документ: не пушить в `main` напрямую (ветка → PR → Vercel Preview → проверка Юлией → merge); перед PR — сборка и lint; откат — Instant Rollback в Vercel; источники правок — Notion, Google-таблица текстов, Google Doc Privacy Policy, Figma.
3. Добавь в `CLAUDE.md` правило про этот файл: по просьбе «прочитай handoff» выполнить последнее задание отсюда и дописать итог в раздел «Ответ» под ним.
4. Закоммить `docs/after-launch-updates.md`, `docs/handoff.md` и правки `CLAUDE.md`. В `CLAUDE.md` уже есть твои незакоммиченные изменения — не потеряй их.
5. Напомни Юлии на шаге 11: защита ветки `main` на GitHub и решение про GitHub Action для синхронизации.

### Ответ
Выполнено 16.11.2026.
- `docs/after-launch-updates.md` прочитан.
- В `CLAUDE.md` раздел «После запуска» (был добавлен раньше по просьбе Юлии) дополнен ссылкой на `docs/after-launch-updates.md`; в список документов добавлены `after-launch-updates.md` и `handoff.md` с правилом «прочитай handoff» → выполнить последнее задание и дописать итог в «Ответ».
- Закоммичены `docs/after-launch-updates.md`, `docs/handoff.md`, `CLAUDE.md` (прежние правки `CLAUDE.md` сохранены).
- **Решить на шаге 11 (напоминание Юлии):** включить защиту ветки `main` на GitHub (merge только через PR); решить, нужна ли GitHub Action для синхронизации Notion и таблицы текстов (и коммитить ли сразу в `main` или через автоматический PR).
