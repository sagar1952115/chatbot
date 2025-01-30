import { useState } from 'react';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <img
        src="/profile.jpg"
        alt="Profile"
        className="w-12 h-12 rounded-full cursor-pointer"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      />
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 z-50">
          <ul>
            <li className="p-2 text-gray-700 hover:bg-gray-100 cursor-pointer">Profile</li>
            <li className="p-2 text-gray-700 hover:bg-gray-100 cursor-pointer">Settings</li>
            <li className="p-2 text-gray-700 hover:bg-gray-100 cursor-pointer">Logout</li>
          </ul>
        </div>
      )}
    </div>
  );
}
