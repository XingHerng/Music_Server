//include the required packages
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

//database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

//initialise Express app
const app = express();
//helps app to read JSON
app.use(express.json());

//start the server
app.listen(port, () => {
    console.log('Server running on port', port);
});

//Example Route: Get all music
app.get('/allmusic', async (req, res) => {
    try{
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.music');
        res.json(rows);
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Server error for allmusic'});
    }
});

//Example Route: Create a new music
app.post('/addmusic', async (req, res) => {
    const {music_name, music_pic, music_artist } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO music(music_name, music_pic, music_artist ) VALUES(?, ?)', [music_name, music_pic, music_artist ]);
        res.status(201).json({message: 'Music' +music_name+' has been added!'});
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not add music'+music_name});
    }
});

// Example Route: Update a music
app.put('/updatemusic/:id', async (req, res) => {
    const { id } = req.params;
    const { music_name, music_pic, music_artist } = req.body;
    try{
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('UPDATE music SET music_name=?, music_pic=?,music_artist=?  WHERE id=?', [music_name, music_pic, music_artist, id]);
        res.status(201).json({ message: 'Music ' + id + ' updated successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not update music ' + id });
    }
});

// Example Route: Delete a music
app.delete('/deletemusic/:id', async (req, res) => {
    const { id } = req.params;
    try{
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM music WHERE id=?', [id]);
        res.status(201).json({ message: 'Music ' + id + ' deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not delete music ' + id });
    }
});