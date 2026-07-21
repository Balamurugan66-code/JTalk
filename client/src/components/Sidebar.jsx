import { useMemo, useRef, useState, useEffect } from "react";
import UserCard from "./UserCard";
import ProfileModal from "./ProfileModal";
import CreateGroupModal from "./CreateGroupModal";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({
  users,
  selectedUser,
  onSelect,
}) {
  const { user: currentUser, logout } = useAuth();

  const [showProfile, setShowProfile] = useState(false);
  const [showCreateGroup, setShowCreateGroup] =
    useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState("");

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;

    return users.filter((user) =>
      user.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

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
            <div className="mt-5 flex items-center justify-between">
              <div
                onClick={() => setShowProfile(true)}
                className="flex items-center gap-3 cursor-pointer"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {currentUser.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <span className="font-semibold">
                  {currentUser.name}
                </span>
              </div>

              <div
                className="relative"
                ref={menuRef}
              >
                <button
                  onClick={() =>
                    setShowMenu(!showMenu)
                  }
                  className="w-9 h-9 rounded-full hover:bg-gray-200 text-xl transition"
                >
                  ⋮
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowCreateGroup(true);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 transition"
                    >
                      👥 Create Group
                    </button>

                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowProfile(true);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 transition"
                    >
                      👤 My Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-5">
            <input
              type="text"
              placeholder="🔍 Search people..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                isSelected={
                  selectedUser?._id === user._id
                }
                onSelect={onSelect}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 mt-10">
              No users found
            </div>
          )}
        </div>
      </div>

      <ProfileModal
        open={showProfile}
        onClose={() => setShowProfile(false)}
      />

      <CreateGroupModal
        open={showCreateGroup}
        onClose={() =>
          setShowCreateGroup(false)
        }
      />
    </>
  );
}