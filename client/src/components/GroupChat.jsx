import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

import { getGroupMessages } from "../services/messageService";

import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import GroupInfoModal from "./GroupInfoModal";

export default function GroupChat({
  group,
  onGroupDeleted,
}) {
  const { socket } = useSocket();
  const { user: currentUser } = useAuth();

  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState(null);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [groupData, setGroupData] = useState(group);

  useEffect(() => {
    setGroupData(group);
  }, [group]);

  useEffect(() => {
    if (!groupData || !socket) return;

    loadMessages();

    socket.emit("join_group", groupData._id);

    return () => {
      socket.emit("leave_group", groupData._id);
    };
  }, [groupData, socket]);

  useEffect(() => {
    if (!socket || !groupData) return;

    const handleNewMessage = (message) => {
      const messageGroup =
        typeof message.group === "object"
          ? message.group._id
          : message.group;

      if (messageGroup !== groupData._id) return;

      setMessages((prev) => {
        const exists = prev.some(
          (m) => m._id === message._id
        );

        if (exists) return prev;

        return [...prev, message];
      });
    };

    socket.on(
      "receive_group_message",
      handleNewMessage
    );

    return () => {
      socket.off(
        "receive_group_message",
        handleNewMessage
      );
    };
  }, [socket, groupData]);

  const loadMessages = async () => {
    try {
      const data = await getGroupMessages(
        groupData._id
      );
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Socket handles appending messages
  const handleMessageSent = () => {};

  if (!groupData) return null;

  return (
    <>
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Header */}
        <div
          onClick={() => setShowGroupInfo(true)}
          className="bg-white border-b px-6 py-4 flex items-center gap-4 shadow-sm cursor-pointer hover:bg-gray-50 transition"
        >
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl">
            👥
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              {groupData.groupName ||
                groupData.name}
            </h2>

            <p className="text-sm text-gray-500">
              {groupData.members?.length || 0} members
            </p>
          </div>
        </div>

        <MessageList
          messages={messages}
          onReply={setReplyMessage}
          isGroup={true}
        />

        <MessageInput
          chatType="group"
          groupId={groupData._id}
          onMessageSent={handleMessageSent}
          replyMessage={replyMessage}
          onCancelReply={() =>
            setReplyMessage(null)
          }
        />
      </div>

      {showGroupInfo && (
        <GroupInfoModal
          group={groupData}
          currentUser={currentUser}
          onClose={() =>
            setShowGroupInfo(false)
          }
          onGroupUpdated={(updatedGroup) => {
            setGroupData(updatedGroup);
          }}
          onGroupDeleted={() => {
            setShowGroupInfo(false);

            if (onGroupDeleted) {
              onGroupDeleted();
            }
          }}
        />
      )}
    </>
  );
}