const express = require('express');
const db = require('./configdb');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const updatenote = async () => {
  try {
    await axios.put(`${API_URL}/${editingId}`, {
      title: editTitle,
      content: editContent
    });

    setEditingId(null);
    fetchNotes();
  } catch (error) {
    console.error(error);
  }
};
app.use(cors());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.get('/notes', (req, res) => {    
    db.query('SELECT * FROM notes', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    }
);
});
app.post('/notes', (req, res) => 
    {    
    const { title, content } = req.body;
    db.query('INSERT INTO notes (title, content) VALUES (?, ?)', [title, content],
         (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'note insert error' , err });
        }  
                    console.log(err);   

          res.json({id: results.insertId, title, content }); 

    }); });

app.delete('/notes/:id', (req, res) => {    
    const { id } = req.params;  
    db.query('DELETE FROM notes WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'note delete error' });
        }
        res.json({ message: 'note deleted successfully' });
    });
});
// Mettre à jour une note
app.put('/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    db.query(
        'UPDATE notes SET title = ?, content = ? WHERE id = ?',
        [title, content, id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'note update error', err });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Note not found' });
            }

            res.json({ id, title, content, message: 'Note updated successfully' });
        }
    );
});
app.put('/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    db.query(
        'UPDATE notes SET title = ?, content = ? WHERE id = ?',
        [title, content, id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'note update error', err });
            }

            res.json({ message: "Note updated successfully" });
        }
    );
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
