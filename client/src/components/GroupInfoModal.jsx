import { useState } from "react";
import {
  removeMember,
  deleteGroup,
} from "../services/conversationService";

export default function GroupInfoModal({
  group,
  currentUser,
  onClose,
  onGroupUpdated,
  onGroupDeleted,
}) {
  const [loading, setLoading] = useState(false);

  if (!group) return null;

  const isAdmin =
    group.admin?._id === currentUser?.id;

  const handleRemoveMember = async (memberId) => {
    const confirmRemove = window.confirm(
      "Remove this member from the group?"
    );

    if (!confirmRemove) return;

    try {
      setLoading(true);

      const updatedGroup = await removeMember(
        group._id,
        memberId
      );

      onGroupUpdated(updatedGroup);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Failed to remove member."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    const confirmDelete = window.confirm(
      "Delete this group permanently?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      await deleteGroup(group._id);

      onGroupDeleted();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Failed to delete group."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-xl shadow-xl overflow-hidden">

        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-bold">
            Group Info
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6">

          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white text-4xl">
              👥
            </div>

            <h3 className="mt-3 text-xl font-semibold">
              {group.groupName}
            </h3>

            <p className="text-gray-500">
              {group.members.length} members
            </p>
          </div>

          <div className="mb-5">
            <h4 className="font-semibold mb-2">
              Admin
            </h4>

            <div className="flex items-center gap-3">
              {group.admin.avatar ? (
                <img
                  src={group.admin.avatar}
                  alt={group.admin.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  {group.admin.name
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <span>{group.admin.name}</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">
              Members
            </h4>

            <div className="space-y-3 max-h-72 overflow-y-auto">

              {group.members.map((member) => (
                <div
                  key={member._id}
                  className="flex justify-between items-center border rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-3">

                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center">
                        {member.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div>
                      <p className="font-medium">
                        {member.name}
                      </p>

                      {member._id === group.admin._id && (
                        <p className="text-xs text-purple-600">
                          Admin
                        </p>
                      )}
                    </div>
                  </div>

                  {isAdmin &&
                    member._id !==
                      group.admin._id && (
                      <button
                        disabled={loading}
                        onClick={() =>
                          handleRemoveMember(
                            member._id
                          )
                        }
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Remove
                      </button>
                    )}
                </div>
              ))}

            </div>
          </div>

          {isAdmin && (
            <button
              disabled={loading}
              onClick={handleDeleteGroup}
              className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
            >
              Delete Group
            </button>
          )}

        </div>
      </div>
    </div>
  );
}