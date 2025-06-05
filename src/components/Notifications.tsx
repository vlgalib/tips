'use client';

import React, { useEffect, useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { realtimeDb, auth } from '@/lib/firebase';
import { ref, onValue, off, update } from 'firebase/database';

interface Notification {
  id: string;
  type: 'tip' | 'message' | 'system';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const notificationsRef = ref(realtimeDb, `notifications/${user.uid}`);
    
    onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notificationsList = Object.entries(data).map(([id, notification]: [string, any]) => ({
          id,
          ...notification,
        }));
        setNotifications(notificationsList.sort((a, b) => b.timestamp - a.timestamp));
        setUnreadCount(notificationsList.filter((n) => !n.read).length);
      }
    });

    return () => {
      off(notificationsRef);
    };
  }, []);

  const markAsRead = async (notificationId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const notificationRef = ref(realtimeDb, `notifications/${user.uid}/${notificationId}`);
    await update(notificationRef, { read: true });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
} 