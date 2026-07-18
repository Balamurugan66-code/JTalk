export default function UserCard({ user, onSelect }) {
  return (
    <div
      onClick={() => onSelect(user)}
      className="flex items-center gap-3 p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer transition"
    >
      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
        {user.name.charAt(0).toUpperCase()}
      </div>

      <div>
        <h3 className="font-semibold">{user.name}</h3>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </div>
  );
}