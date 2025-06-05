import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  Timestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import type { User, Restaurant, StaffMember, Tip, Notification } from '@/types/firebase';

// User utilities
export const getUser = async (uid: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists() ? (userDoc.data() as User) : null;
};

// Restaurant utilities
export const getRestaurant = async (id: string): Promise<Restaurant | null> => {
  const restaurantDoc = await getDoc(doc(db, 'restaurants', id));
  return restaurantDoc.exists() ? (restaurantDoc.data() as Restaurant) : null;
};

export const getRestaurantByOwner = async (ownerId: string): Promise<Restaurant | null> => {
  const q = query(collection(db, 'restaurants'), where('ownerId', '==', ownerId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty ? null : (querySnapshot.docs[0].data() as Restaurant);
};

// Staff utilities
export const getStaffMembers = async (restaurantId: string): Promise<StaffMember[]> => {
  const q = query(
    collection(db, 'staff'),
    where('restaurantId', '==', restaurantId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StaffMember));
};

export const addStaffMember = async (staffData: Omit<StaffMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'staff'), {
    ...staffData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

// Tip utilities
export const getTips = async (staffId: string, limitCount: number = 10): Promise<Tip[]> => {
  const q = query(
    collection(db, 'tips'),
    where('staffId', '==', staffId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tip));
};

export const addTip = async (tipData: Omit<Tip, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'tips'), {
    ...tipData,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

// Notification utilities
export const getNotifications = async (userId: string, limitCount: number = 10): Promise<Notification[]> => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
};

export const addNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'notifications'), {
    ...notificationData,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await updateDoc(doc(db, 'notifications', notificationId), {
    read: true
  });
}; 