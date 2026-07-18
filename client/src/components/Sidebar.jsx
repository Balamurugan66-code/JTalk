import UserCard from "./UserCard";

export default function Sidebar({ users, onSelect }) {
  return (
    <div className="w-80 bg-white border-r border-gray-300 flex flex-col">
      <div className="p-5 shadow-sm">
        <h1 className="text-3xl font-bold text-blue-600">
          JTalk
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}