import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function listMisfortunes() {
  const q = query(collection(db, "misfortunes"), orderBy("order", "desc"));

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function createMisfortune(data) {
  const now = Date.now();

  const ref = await addDoc(collection(db, "misfortunes"), {
    label: data.label || "",
    order: Number(data.order || 0),
    created_at: now,
    updated_at: now,
  });

  return ref.id;
}

export async function updateMisfortune(id, data) {
  await updateDoc(doc(db, "misfortunes", id), {
    ...data,
    updated_at: Date.now(),
  });
}

export async function deleteMisfortune(id) {
  await deleteDoc(doc(db, "misfortunes", id));
}
