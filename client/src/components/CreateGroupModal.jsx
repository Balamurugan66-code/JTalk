import { useEffect, useState } from "react";
import api from "../services/api";

export default function CreateGroupModal({
  open,
  onClose,
}) {
  const [users, setUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] =
    useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    async function loadUsers() {
      try {
        const res = await api.get("/users");

        setUsers(res.data);
        setGroupName("");
        setSelectedMembers([]);
      } catch (err) {
        console.error(err);
      }
    }

    loadUsers();
  }, [open]);

  const toggleMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id]
    );
  };

  const createGroup = async () => {
    if (!groupName.trim()) {
      return alert("Enter group name.");
    }

    if (selectedMembers.length < 2) {
      return alert(
        "Select at least 2 members."
      );
    }

    try {
      setLoading(true);

      await api.post("/groups", {
        groupName,
        members: selectedMembers,
      });

      alert("Group created successfully.");

      onClose();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to create group."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[420px] rounded-xl shadow-xl p-6">

        <h2 className="text-2xl font-bold mb-5">
          Create Group
        </h2>

        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) =>
            setGroupName(e.target.value)
          }
          className="w-full border rounded-lg px-3 py-2 mb-5"
        />

        <div className="border rounded-lg max-h-64 overflow-y-auto">

          {users.map((user) => (
            <label
              key={user._id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedMembers.includes(
                  user._id
                )}
                onChange={() =>
                  toggleMember(user._id)
                }
              />

              {user.avatar ? (
                <img
                  src={user.avatar}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {user.name
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <span>{user.name}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={createGroup}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            {loading
              ? "Creating..."
              : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}