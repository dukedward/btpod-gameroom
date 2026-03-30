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

export async function listScores(userUid) {
  const q = query(collection(db, "scores"), orderBy("created_at", "desc"));

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function filterScores(filters = {}) {
  let q = collection(db, "scores");

  if (filters.game_id !== undefined) {
    q = query(q, where("game_id", "==", filters.game_id));
  } else {
    q = query(q, orderBy("name", "asc"));
  }

  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function createScore(data) {
  const now = Date.now();

  const ref = await addDoc(collection(db, "scores"), {
    game_id: data.game_id || "",
    player_email: data.player_email || "",
    player_name: data.player_name || "",
    points_awarded: Number(data.points_awarded || 0),
    created_at: now,
    updated_at: now,
  });

  return ref.id;
}

export async function updateScore(id, data) {
  await updateDoc(doc(db, "scores", id), {
    ...data,
    updated_at: Date.now(),
  });
}

export async function deleteScore(id) {
  await deleteDoc(doc(db, "scores", id));
}
