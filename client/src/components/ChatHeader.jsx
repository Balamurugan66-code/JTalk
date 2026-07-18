export default function ChatHeader({ user }) {
  return (
    <div className="h-20 bg-white border-b border-gray-300 flex items-center px-6 shadow-sm">
      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
        {user.name.charAt(0).toUpperCase()}
      </div>

      <div className="ml-4">
        <h2 className="font-semibold text-lg">{user.name}</h2>
        <p className="text-sm text-green-600">Online</p>
      </div>
    </div>
  );
}