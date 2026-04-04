# P5 Calendar

Persona 5 風デザインのPWAカレンダー & タスク管理アプリ。

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL)
- FullCalendar
- vite-plugin-pwa

## Features

- カレンダー表示（月/週切り替え）
- 予定の追加・編集・削除（ドラッグ&ドロップ対応）
- タスク管理（優先度付きToDo）
- Web Push リマインダー通知
- PWA（ホーム画面に追加可能）

## Setup

### 1. Supabase

Supabase ダッシュボードの SQL Editor で `sql/setup.sql` を実行してテーブルを作成。

### 2. 環境変数

```bash
cp .env.example .env
```

`.env` に Supabase の URL と Anon Key を設定。

### 3. ローカル開発

```bash
npm install --legacy-peer-deps
npm run dev
```

## Vercel デプロイ

### 1. リポジトリ準備

```bash
cd projects/calendar-app
git init
git add .
git commit -m "initial commit"
```

GitHub にリポジトリを作成し push。

### 2. Vercel 設定

1. [vercel.com](https://vercel.com) にログイン
2. 「Add New Project」→ GitHub リポジトリを選択
3. **Framework Preset**: Vite
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `npm install --legacy-peer-deps`
7. **Environment Variables** に以下を追加:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
8. 「Deploy」をクリック

### 3. カスタムドメイン（任意）

Vercel ダッシュボード → Settings → Domains からドメインを追加。

## Project Structure

```
src/
├── components/
│   ├── Calendar.tsx     # FullCalendar wrapper
│   ├── EventModal.tsx   # Event create/edit modal
│   ├── Header.tsx       # App header with notification toggle
│   └── TaskPanel.tsx    # Task list sidebar
├── lib/
│   ├── supabase.ts      # Supabase client
│   └── notifications.ts # Web Push notification utils
├── types/
│   └── database.ts      # Supabase type definitions
├── App.tsx
├── main.tsx
└── index.css            # Tailwind + P5 theme + FullCalendar overrides
```
