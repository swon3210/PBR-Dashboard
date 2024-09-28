import { initializeApp } from 'firebase/app';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';

import type { InfoRecord } from '@/types/info';

const firebaseConfig = {
  apiKey: 'AIzaSyAeG9o97QC1y8Ul_FhQ46XHOQU97qQ9S-E',
  authDomain: 'pbr-dashboard-ea215.firebaseapp.com',
  projectId: 'pbr-dashboard-ea215',
  storageBucket: 'pbr-dashboard-ea215.appspot.com',
  messagingSenderId: '1072053034228',
  appId: '1:1072053034228:web:edb6dfaf5f7027ed6692a1',
};

export const COLLECTION = {
  COMPANIES: 'companies',
  PBR: 'PBR',
  EPS: 'EPS',
  PER: 'PER',
};

const app = initializeApp(firebaseConfig);

const db = getFirestore();

const getCollectionRef = (collectionName: string) => collection(db, collectionName);
const getCollectionRefWithDocId = (collectionName: string, docId: string, docCollectionName: string) =>
  collection(db, collectionName, docId, docCollectionName);
const getDocRef = (collectionName: string, docId: string) => doc(db, collectionName, docId);
const getDocRefWithDocId = (
  collectionName: string,
  docId: string,
  docCollectionName: string,
  docCollectionDocId: string
) => doc(db, collectionName, docId, docCollectionName, docCollectionDocId);

export const getItems = async <T>(collectionName: string) => {
  const { docs } = await getDocs(getCollectionRef(collectionName));

  return docs.map((docObject) => ({ ...docObject.data(), id: docObject.id })) as T[];
};

export const getItemsWithDocId = async <T>(collectionName: string, docId: string, docCollectionName: string) => {
  const { docs } = await getDocs(getCollectionRefWithDocId(collectionName, docId, docCollectionName));

  return docs.map((docObject) => ({ ...docObject.data(), id: docObject.id })) as T[];
};

export const getItem = async (collectionName: string, id: string) => {
  const docObject = await getDoc(getDocRef(collectionName, id));

  return { ...docObject.data(), id: docObject.id };
};

export const searchItems = async (collectionName: string, field: string, value: string) => {
  const getQuery = query(getCollectionRef(collectionName), where(field, '==', value));
  const { docs } = await getDocs(getQuery);

  return docs.map((docObject) => ({ ...docObject.data(), id: docObject.id }));
};

export const getTimestamp = () => serverTimestamp();

export const setItems = async (collectionName: string, items: ({ id: string } & Record<string, unknown>)[]) => {
  const promises: Promise<void>[] = [];

  items.forEach((item) => {
    const { id: docId, ...data } = item;
    const docRef = getDocRef(collectionName, docId);
    promises.push(setDoc(docRef, data));
  });

  await Promise.all(promises);
};

export const setItemsWithDocId = async (
  collectionName: string,
  collectionDocId: string,
  docCollectionName: string,
  records: InfoRecord[]
) => {
  const promises: Promise<void>[] = [];

  records.forEach((record) => {
    const { id, ...rest } = record;

    const docRef = getDocRefWithDocId(collectionName, collectionDocId, docCollectionName, id);
    promises.push(setDoc(docRef, { ...rest }));
  });

  await Promise.all(promises);
};

export default app;
