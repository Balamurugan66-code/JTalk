export default function UserCard({ user, onSelect }) {
  return (
    <div
      onClick={() => onSelect(user)}
      className="flex items-center gap-3 p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer transition"
    >
      {/* Avatar */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
          {user.name.charAt(0).toUpperCase()}
        </div>

        {/* Online Status */}
        <span
          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
            user.isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        ></span>
      </div>

      {/* User Details */}
      <div className="flex-1">
        <h3 className="font-semibold">{user.name}</h3>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </div>
  );
}