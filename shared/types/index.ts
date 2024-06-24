// AUTO GENERATED FILE BY @kalissaac/prisma-typegen
// DO NOT EDIT

export interface auth_provider {
  user_id: string;
  google_id?: string | null;
  github_id?: string | null;
  discord_id?: string | null;
}

export interface room {
  room_id?: string;
  creator_id?: string | null;
  room_desc?: string | null;
  is_private?: boolean | null;
  auto_speaker?: boolean | null;
  chat_enabled?: boolean | null;
  created_at?: (Date | string) | null;
  hand_raise_enabled?: boolean | null;
  last_active?: (Date | string) | null;
  ended?: boolean | null;
  map_key: string;
}

export interface room_ban {
  room_id: string;
  user_id: string;
  ban_type?: string | null;
  created_at?: (Date | string) | null;
}

export interface room_category {
  room_id: string;
  category: string;
}

export interface room_status {
  user_id: string;
  room_id: string;
  is_speaker?: boolean | null;
  is_mod?: boolean | null;
  raised_hand?: boolean | null;
  created_at?: (Date | string) | null;
  is_muted?: boolean | null;
  pos_x: number;
  pos_y: number;
  dir: string;
  skin: string;
}

export interface user_data {
  user_id?: string;
  user_name?: string | null;
  email?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  current_room_id?: string | null;
  created_at?: (Date | string) | null;
  last_seen?: (Date | string) | null;
}

export interface user_follows {
  user_id: string;
  is_following: string;
  created_at?: (Date | string) | null;
}

export interface user_notification {
  notification_id?: string;
  user_id?: string | null;
  room_id?: string | null;
  category?: string | null;
  content?: string | null;
  is_read?: boolean | null;
  created_at?: (Date | string) | null;
}

// Camel Case versions
export interface AuthProvider {
  userId: string;
  googleId?: string | null;
  githubId?: string | null;
  discordId?: string | null;
}

export interface Room {
  roomId?: string;
  creatorId?: string | null;
  roomDesc?: string | null;
  isPrivate?: boolean | null;
  autoSpeaker?: boolean | null;
  chatEnabled?: boolean | null;
  createdAt?: (Date | string) | null;
  handRaiseEnabled?: boolean | null;
  lastActive?: (Date | string) | null;
  ended?: boolean | null;
  mapKey: string;
}

export type RoomParticipant = UserData & {
  indicatorOn: boolean | undefined;
  isMod: boolean;
  isSpeaker: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  raisedHand: boolean;
  followers: number;
  following: number;
  followsMe: boolean;
};

export interface RoomBan {
  roomId: string;
  userId: string;
  banType?: string | null;
  createdAt?: (Date | string) | null;
}

export interface RoomCategory {
  roomId: string;
  category: string;
}

export interface RoomStatus {
  userId: string;
  roomId: string;
  isSpeaker?: boolean | null;
  isMod?: boolean | null;
  raisedHand?: boolean | null;
  createdAt?: (Date | string) | null;
  isMuted?: boolean | null;
  isVideoOff?: boolean | null;
  posX: number;
  posY: number;
  dir: string;
  skin: string;
}

export interface UserData {
  userId?: string;
  userName?: string | null;
  email?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  currentRoomId?: string | null;
  createdAt?: (Date | string) | null;
  lastSeen?: (Date | string) | null;
}

export interface UserFollows {
  userId: string;
  isFollowing: string;
  createdAt?: (Date | string) | null;
}

export interface UserNotification {
  notificationId?: string;
  userId?: string | null;
  roomId?: string | null;
  category?: string | null;
  content?: string | null;
  isRead?: boolean | null;
  createdAt?: (Date | string) | null;
}
