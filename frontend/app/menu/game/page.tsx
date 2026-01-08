"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import ChessboardComponent from "@/components/ChessboardComponent";

type Note = {
  _id: string;
  title: string;
  content: string;
};

export default function Game() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // redirect if not logged in
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading]);

  // fetch notes
  // useEffect(() => {
  //   if (user) {
  //     api.get<Note[]>("/notes").then(res => setNotes(res.data));
  //   }
  // }, [user]);

  // create note
  const createNote = async () => {
    if (!title || !content) return;
    setSubmitting(true);
    const res = await api.post<Note>("/notes", { title, content });
    setNotes(prev => [res.data, ...prev]);
    setTitle("");
    setContent("");
    setSubmitting(false);
  };

  // delete note
  const deleteNote = async (id: string) => {
    await api.delete(`/notes/${id}`);
    setNotes(prev => prev.filter(n => n._id !== id));
  };

  // start editing
  const startEdit = (note: Note) => {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  // cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  // save edit
  const saveEdit = async (id: string) => {
    const res = await api.put<Note>(`/notes/${id}`, {
      title: editTitle,
      content: editContent,
    });
    setNotes(prev =>
      prev.map(n => (n._id === id ? res.data : n))
    );
    cancelEdit();
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Welcome, {user?.username}</h1><h1 className="text-2xl font-semibold">Online Chess</h1>
        <button
          onClick={logout}
          className="text-sm text-red-400 hover:text-red-500 hover:cursor-pointer"
        >
          Logout
        </button>
      </div>
      {/* Main */}
      <div className="container mx-auto flex flex-col md:flex-row">
        <div className="w-full md:w-1/3">Hello</div>
        <div className="w-full md:w-2/3"><div className="m-auto" style={{width:600}}><ChessboardComponent /></div></div>
      </div>
      
    </div>
  );
}
