import React, { useEffect, useState } from "react";
import axios from "axios";
import "./note.css";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // States for update
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const API_URL = "http://localhost:3000/notes";

  const fetchNotes = async () => {
    try {
      const response = await axios.get(API_URL);
      setNotes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async () => {
    if (!title || !content) return;
    try {
      await axios.post(API_URL, { title, content });
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchNotes();
    } catch (error) {
      console.error(error);
    }
  };

  // Start editing
  const startEdit = (note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  // Save update
  const updateNote = async () => {
    try {
      await axios.put(`${API_URL}/${editingId}`, {
        title: editTitle,
        content: editContent,
      });

      setEditingId(null);
      fetchNotes();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="notes-container">
      <h1>Notes Manager</h1>

      <div className="add-note">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={addNote} className="btn add-btn">
          Add Note
        </button>
      </div>

      <div className="notes-list">
        {notes.map((note) => (
          <div key={note.id} className="note-card">
            {editingId === note.id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button onClick={updateNote} className="btn add-btn">
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="btn delete-btn"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h3>{note.title}</h3>
                <p>{note.content}</p>

                <button
                  onClick={() => startEdit(note)}
                  className="btn add-btn"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteNote(note.id)}
                  className="btn delete-btn"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
