import { useState } from "react";
import UserCard from "./UserCard";
import ProfileModal from "./ProfileModal";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({
  users,
  selectedUser,
  onSelect,
}) {
  const { user: currentUser, logout } = useAuth();

  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <div className="w-80 bg-white border-r border-gray-300 flex flex-col">
        <div className="p-5 shadow-sm border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-blue-600">
              JTalk
            </h1>

            <button
              onClick={logout}
              className="text-sm px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>

          {currentUser && (
            <div
              onClick={() => setShowProfile(true)}
              className="mt-4 flex items-center gap-3 cursor-pointer rounded-lg p-2 hover:bg-gray-100 transition"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-full object-cover"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  {currentUser.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">
                  {currentUser.name}
                </p>

                <p className="text-sm text-gray-500 truncate">
                  {currentUser.about ||
                    "Hey there! I'm using JTalk."}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              isSelected={selectedUser?._id === user._id}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>

      <ProfileModal
        open={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </>
  );
}