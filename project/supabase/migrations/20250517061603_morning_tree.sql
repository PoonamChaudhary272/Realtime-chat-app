/*
  # Initial Chat Application Schema

  1. New Tables
    - users
      - id (uuid, primary key)
      - username (text, unique)
      - email (text, unique)
      - password_hash (text)
      - last_active (timestamptz)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - rooms
      - id (uuid, primary key)
      - name (text, unique)
      - description (text)
      - created_by (uuid, references users)
      - is_private (boolean)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - messages
      - id (uuid, primary key)
      - content (text)
      - sender_id (uuid, references users)
      - room_id (uuid, references rooms)
      - created_at (timestamptz)
    
    - room_members
      - room_id (uuid, references rooms)
      - user_id (uuid, references users)
      - joined_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  last_active timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_by uuid REFERENCES users(id),
  is_private boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  sender_id uuid REFERENCES users(id),
  room_id uuid REFERENCES rooms(id),
  created_at timestamptz DEFAULT now()
);

-- Create room_members table
CREATE TABLE IF NOT EXISTS room_members (
  room_id uuid REFERENCES rooms(id),
  user_id uuid REFERENCES users(id),
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (room_id, user_id)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Rooms policies
CREATE POLICY "Anyone can read public rooms"
  ON rooms
  FOR SELECT
  TO authenticated
  USING (NOT is_private OR created_by = auth.uid() OR EXISTS (
    SELECT 1 FROM room_members WHERE room_id = rooms.id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create rooms"
  ON rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Messages policies
CREATE POLICY "Users can read messages in their rooms"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM rooms r
      LEFT JOIN room_members rm ON r.id = rm.room_id
      WHERE r.id = messages.room_id
      AND (NOT r.is_private OR r.created_by = auth.uid() OR rm.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages to their rooms"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM rooms r
      LEFT JOIN room_members rm ON r.id = rm.room_id
      WHERE r.id = room_id
      AND (NOT r.is_private OR r.created_by = auth.uid() OR rm.user_id = auth.uid())
    )
  );

-- Room members policies
CREATE POLICY "Users can see room members"
  ON room_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM rooms r
      WHERE r.id = room_id
      AND (NOT r.is_private OR r.created_by = auth.uid() OR EXISTS (
        SELECT 1 FROM room_members rm WHERE rm.room_id = r.id AND rm.user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Users can join rooms"
  ON room_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM rooms r
      WHERE r.id = room_id AND NOT r.is_private
    )
  );