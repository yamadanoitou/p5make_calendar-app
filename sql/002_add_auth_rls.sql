-- ===== P5 Calendar: 認証 + RLS マイグレーション =====
-- Supabase SQL Editor で実行してください
-- 前提: Supabase Dashboard > Authentication > Email を有効にしておく

-- 1. events テーブルに user_id カラムを追加
ALTER TABLE events ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. tasks テーブルに user_id カラムを追加
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 3. 既存の全公開ポリシーを削除
DROP POLICY IF EXISTS "Allow all access to events" ON events;
DROP POLICY IF EXISTS "Allow all access to tasks" ON tasks;

-- 4. events の RLS ポリシー（自分のデータのみ）
CREATE POLICY "Users can view own events" ON events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events" ON events
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own events" ON events
  FOR DELETE USING (auth.uid() = user_id);

-- 5. tasks の RLS ポリシー（自分のデータのみ）
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- 6. user_id カラムにインデックスを追加
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events (user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks (user_id);
