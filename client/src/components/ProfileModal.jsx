import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ProfileModal({
  open,
  onClose,
}) {
  const { updateUser } = useAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    about: "",
    avatar: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (!open) return;

    async function loadProfile() {
      try {
        const res = await api.get("/users/profile");

        setForm({
          name: res.data.name,
          about: res.data.about,
          avatar: res.data.avatar || "",
        });

        setAvatarFile(null);
      } catch (err) {
        console.error(err);
      }
    }

    loadProfile();
  }, [open]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setAvatarFile(file);

    setForm((prev) => ({
      ...prev,
      avatar: URL.createObjectURL(file),
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", form.name);
      data.append("about", form.about);

      if (avatarFile) {
        data.append("avatar", avatarFile);
      }

      const res = await api.put(
        "/users/profile",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      updateUser(res.data.user);

      alert("Profile updated successfully.");

      onClose();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[420px] bg-white rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6">
          My Profile
        </h2>

        <div className="flex flex-col items-center mb-6">
          <label className="cursor-pointer">
            {form.avatar ? (
              <img
                src={form.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                {form.name
                  ? form.name.charAt(0).toUpperCase()
                  : "?"}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>

          <p className="text-xs text-gray-500 mt-2">
            Click the picture to change it
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">
              Name
            </label>

            <input
              className="w-full border rounded-lg px-3 py-2"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              About
            </label>

            <textarea
              className="w-full border rounded-lg px-3 py-2 resize-none"
              rows={3}
              maxLength={120}
              name="about"
              value={form.about}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}