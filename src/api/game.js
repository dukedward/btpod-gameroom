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

export async function listGames() {
  const q = query(collection(db, "games"), orderBy("created_at", "desc"));

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function filterGames(filters = {}) {
  let q = collection(db, "games");

  if (filters.status !== undefined) {
    q = query(q, where("status", "==", filters.status));
  } else {
    q = query(q, orderBy("name", "asc"));
  }

  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function createGame(data) {
  const now = Date.now();

  const ref = await addDoc(collection(db, "games"), {
    title: data.title || "",
    status: data.status || "waiting",
    current_round: data.current_round || 1,
    current_turn: data.current_turn || "",
    current_question: data.current_question || "",
    current_answers: (data.items || []).map((item) => ({
      text: item.text || "",
      points: Number(item.points || 0),
      revealed: item.revealed || false,
    })),
    revealed_info: data.revealed_info || "",
    buzzed_in_by: data.buzzed_in_by || "",
    buzzed_in_name: data.buzzed_in_name || "",
    buzz_locked: data.buzz_locked || false,
    culture_tags_category: data.culture_tags_category || "",
    culture_tags_phrase: data.culture_tags_phrase || "",
    culture_tags_acronym: data.culture_tags_acronym || "",
    culture_tags_chooser: data.culture_tags_chooser || "",
    created_at: now,
    updated_at: now,
  });

  return ref.id;
}

export async function updateGame(id, data) {
  await updateDoc(doc(db, "games", id), {
    ...data,
    updated_at: Date.now(),
  });
}

export async function deleteGame(id) {
  await deleteDoc(doc(db, "games", id));
}
