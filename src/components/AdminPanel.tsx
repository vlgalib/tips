'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import {
  UserPlusIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

interface StaffMember {
  id: string;
  name: string;
  walletAddress: string;
  isActive: boolean;
  totalTips: number;
}

interface AdminPanelProps {
  restaurantId: string;
}

export default function AdminPanel({ restaurantId }: AdminPanelProps) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newStaff, setNewStaff] = useState({
    name: '',
    walletAddress: '',
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const staffRef = collection(db, 'staff');
        const q = query(
          staffRef,
          where('restaurantId', '==', restaurantId)
        );

        const querySnapshot = await getDocs(q);
        const staffData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as StaffMember[];

        setStaff(staffData);
      } catch (err) {
        setError('Failed to fetch staff members');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, [restaurantId]);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const staffRef = collection(db, 'staff');
      await addDoc(staffRef, {
        ...newStaff,
        restaurantId,
        isActive: true,
        totalTips: 0,
        createdAt: new Date(),
      });

      setNewStaff({ name: '', walletAddress: '' });
      // Refresh staff list
      const q = query(staffRef, where('restaurantId', '==', restaurantId));
      const querySnapshot = await getDocs(q);
      const staffData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as StaffMember[];
      setStaff(staffData);
    } catch (err) {
      setError('Failed to add staff member');
      console.error(err);
    }
  };

  const handleToggleActive = async (staffId: string, currentStatus: boolean) => {
    try {
      const staffRef = doc(db, 'staff', staffId);
      await updateDoc(staffRef, {
        isActive: !currentStatus,
      });

      setStaff(staff.map((member) =>
        member.id === staffId
          ? { ...member, isActive: !currentStatus }
          : member
      ));
    } catch (err) {
      setError('Failed to update staff status');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Staff Member</h2>
        <form onSubmit={handleAddStaff} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700">
              Wallet Address
            </label>
            <input
              type="text"
              id="walletAddress"
              value={newStaff.walletAddress}
              onChange={(e) => setNewStaff({ ...newStaff, walletAddress: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Staff Member
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Staff Members</h2>
        <div className="space-y-4">
          {staff.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <UserGroupIcon className="h-6 w-6 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-500">
                    {member.walletAddress.slice(0, 6)}...{member.walletAddress.slice(-4)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">${member.totalTips.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => handleToggleActive(member.id, member.isActive)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    member.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {member.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-center text-red-600 p-4">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
} 