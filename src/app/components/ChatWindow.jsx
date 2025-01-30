export default function ChatWindow() {
    return (
      <div className="flex flex-col p-4 h-full overflow-y-auto">
        <div className="flex-1 space-y-4">
          {/* User Message */}
          <div className="bg-blue-500 text-white p-3 rounded-xl max-w-xs self-end">
            Hi there!
          </div>
          {/* Assistant Message */}
          <div className="bg-gray-200 text-gray-800 p-3 rounded-xl max-w-xs">
            Hello! How can I assist you today?
          </div>
        </div>
      </div>
    );
  }
  