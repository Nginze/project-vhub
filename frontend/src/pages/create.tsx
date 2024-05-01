import { api } from "@/api";
import { userContext } from "@/context/UserContext";
import { useMutation } from "@tanstack/react-query";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

const Create: NextPage = () => {
  const { user } = useContext(userContext);
  const router = useRouter();

  const [roomDesc, setRoomDesc] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [autoSpeaker, setAutoSpeaker] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(false);
  const [handRaiseEnabled, setHandRaiseEnabled] = useState(false);
  const [mapKey, setMapKey] = useState("test-map");

  const createRoomMutation = useMutation({
    mutationFn: async (params: {
      roomDesc: string;
      creatorId: string;
      isPrivate: boolean;
      autoSpeaker: boolean;
      chatEnabled: boolean;
      handRaiseEnabled: boolean;
      mapKey: string;
    }) => {
      const { data } = await api.post("/room/create", params);
      return data;
    },

    onSuccess: async (data: { roomId: string }, variables) => {
      //   console.log(conn, data);
      //   // if (data && conn) {
      //   console.log("sending room data to voice server", data.roomId);
      //   conn.emit("rtc:create_room", { roomId: data.roomId });
      //   // } else {
      //   //   alert("something went wront during creation try again");
      //   // }
      router.push(`/room/${data.roomId}`);
    },

    onError: () => {
      //   toast("Connection Failed. Try again", {
      //     icon: "❌",
      //     style: {
      //       borderRadius: "10px",
      //       background: "#333",
      //       color: "#fff",
      //     },
      //   });
    },
  });
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100 text-black">
      <div className="bg-white p-10 rounded-lg shadow-md">
        <h2 className="text-2xl mb-4">Create a Space</h2>
        <input
          type="text"
          placeholder="Enter Room Desc"
          value={roomDesc}
          onChange={(e) => setRoomDesc(e.target.value)}
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        />

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="mr-2"
          />
          <label>Is Private</label>
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={autoSpeaker}
            onChange={(e) => setAutoSpeaker(e.target.checked)}
            className="mr-2"
          />
          <label>Auto Speaker</label>
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={chatEnabled}
            onChange={(e) => setChatEnabled(e.target.checked)}
            className="mr-2"
          />
          <label>Chat Enabled</label>
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={handRaiseEnabled}
            onChange={(e) => setHandRaiseEnabled(e.target.checked)}
            className="mr-2"
          />
          <label>Hand Raise Enabled</label>
        </div>

        <select
          value={mapKey}
          onChange={(e) => setMapKey(e.target.value)}
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        >
          <option value="test-map">Test Map</option>
        </select>

        <button
          onClick={() => {
            createRoomMutation.mutate({
              roomDesc,
              creatorId: user.userId as string,
              isPrivate,
              autoSpeaker,
              handRaiseEnabled,
              chatEnabled,
              mapKey,
            });
          }}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Start Room
        </button>
      </div>
    </div>
  );
};

export default Create;
