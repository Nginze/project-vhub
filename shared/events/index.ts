export enum WS_MESSAGE {
  // Conn messages
  DISCONNECTING = "disconnecting",
  DISCONNECT = "disconnect",

  // Chat messages
  CHAT_GLOBAL_NEW_MESSAGE = "chat:global_new_message",

  // Room messages
  ROOM_JOIN = "room:join",
  ROOM_MOVE = "room:move",
  USER_SPEAKING = "user-speaking",
  USER_STOPPED_SPEAKING = "user-stopped-speaking",

  // RTC messages
  RTC_CREATE_ROOM = "rtc:create_room",
  RTC_JOIN_ROOM = "rtc:join_room",
  RTC_CONNECT_TRANSPORT = "rtc:connect_transport",
  RTC_SEND_TRACK = "rtc:send_track",
  RTC_GET_RECV_TRACKS = "rtc:get_recv_tracks",
  RTC_ADD_SPEAKER = "rtc:add_speaker",
  RTC_REMOVE_SPEAKER = "rtc:remove_speaker",
}

export enum RTC_MESSAGE {
  // RECV MESSAGES
  CREATE_ROOM = "create-room",
  JOIN_AS_SPEAKER = "join-as-speaker",
  JOIN_AS_NEW_PEER = "join-as-new-peer",
  ADD_SPEAKER = "add-speaker",
  REMOVE_SPEAKER = "remove-speaker",
  CLOSE_PEER = "close-peer",
  DESTROY_ROOM = "destroy-room",
  CONNECT_TRANSPORT = "connect-transport",
  GET_RECV_TRACKS = "get-recv-tracks",
  SEND_TRACK = "send-track",
  //SEND MESSAGES
  ROOM_CREATED = "room-created",
  YOU_JOINED_AS_A_SPEAKER = "you-joined-as-a-speaker",
  YOU_JOINED_AS_A_PEER = "you-joined-as-a-peer",
  YOU_ARE_NOW_A_SPEAKER = "you-are-now-a-speaker",
  USER_LEFT_ROOM = "user-left-room",
  GET_RECV_TRACKS_DONE = "@get-recv-tracks-done",
  CLOSE_CONSUMER = "close-consumer",
  NEW_PEER_SPEAKER = "new-peer-speaker",
  SEND_TRACK_DONE = "@send-track-done",
  ERROR = "error",
}

export type MESSAGE = WS_MESSAGE | RTC_MESSAGE;
