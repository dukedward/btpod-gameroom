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

export async function listQuestions(userUid) {
  const q = query(collection(db, "questions"), orderBy("created_at", "desc"));

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function filterQuestions(filters = {}) {
  let q = collection(db, "questions");

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

export async function createQuestion(data) {
  const now = Date.now();

  const ref = await addDoc(collection(db, "questions"), {
    game_id: data.game_id || "",
    question: data.question || "",
    answer: data.answer || "",
    answer_by: data.answer_by || "",
    points_awarded: Number(data.points_awarded || 0),
    round: Number(data.round || 0),
    created_at: now,
    updated_at: now,
  });

  return ref.id;
}

export async function updateQuestion(id, data) {
  await updateDoc(doc(db, "questions", id), {
    ...data,
    updated_at: Date.now(),
  });
}

export async function deleteQuestion(id) {
  await deleteDoc(doc(db, "questions", id));
}
