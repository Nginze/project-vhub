// Duplicating because of compiler resulution errors

// ---------------------------------------------

// MS: for mediaserver (mediasoup)
// WS: for websocket server (socket.io)

export enum WS_MESSAGE {
  // Conn messages
  WS_DISCONNECTING = "disconnecting",
  WS_DISCONNECT = "disconnect",

  // Chat messages
  WS_CHAT_GLOBAL_NEW_MESSAGE = "chat:global_new_message",

  // Room messages
  WS_ROOM_JOIN = "room:join",
  WS_ROOM_MOVE = "room:move",
  WS_USER_SPEAKING = "room:user-speaking",
  WS_USER_STOPPED_SPEAKING = "room:user-stopped-speaking",
  WS_NEW_USER_JOINED_ROOM = "room:new-user-joined-room",
  WS_PARTICIPANT_MOVED = "room:participant-moved",
  WS_PARTICIPANT_LEFT = "room:participant-left",

  // RTC SEND messages
  RTC_WS_CREATE_ROOM = "rtc:create_room",
  RTC_WS_JOIN_ROOM = "rtc:join_room",
  RTC_WS_CONNECT_TRANSPORT = "rtc:connect_transport",
  RTC_WS_SEND_TRACK = "rtc:send_track",
  RTC_WS_GET_RECV_TRACKS = "rtc:get_recv_tracks",
  RTC_WS_ADD_SPEAKER = "rtc:add_speaker",
  RTC_WS_REMOVE_SPEAKER = "rtc:remove_speaker",
}

export enum RTC_MESSAGE {
  // RECV MESSAGES
  RTC_MS_RECV_CREATE_ROOM = "create-room",
  RTC_MS_RECV_JOIN_AS_SPEAKER = "join-as-speaker",
  RTC_MS_RECV_JOIN_AS_NEW_PEER = "join-as-new-peer",
  RTC_MS_RECV_ADD_SPEAKER = "add-speaker",
  RTC_MS_RECV_REMOVE_SPEAKER = "remove-speaker",
  RTC_MS_RECV_CLOSE_PEER = "close-peer",
  RTC_MS_RECV_DESTROY_ROOM = "destroy-room",
  RTC_MS_RECV_CONNECT_TRANSPORT = "connect-transport",
  RTC_MS_RECV_GET_RECV_TRACKS = "get-recv-tracks",
  RTC_MS_RECV_SEND_TRACK = "send-track",
  //SEND MESSAGES
  RTC_MS_SEND_ROOM_CREATED = "room-created",
  RTC_MS_SEND_YOU_JOINED_AS_A_SPEAKER = "you-joined-as-a-speaker",
  RTC_MS_SEND_YOU_JOINED_AS_A_PEER = "you-joined-as-a-peer",
  RTC_MS_SEND_YOU_ARE_NOW_A_SPEAKER = "you-are-now-a-speaker",
  RTC_MS_SEND_USER_LEFT_ROOM = "user-left-room",
  RTC_MS_SEND_GET_RECV_TRACKS_DONE = "@get-recv-tracks-done",
  RTC_MS_SEND_CLOSE_CONSUMER = "close-consumer",
  RTC_MS_SEND_NEW_PEER_SPEAKER = "new-peer-speaker",
  RTC_MS_SEND_SEND_TRACK_DONE = "@send-track-done",
  RTC_MS_SEND_ERROR = "error",
}

export type MESSAGE = WS_MESSAGE | RTC_MESSAGE;
