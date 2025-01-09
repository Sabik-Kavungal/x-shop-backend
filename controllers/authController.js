const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const register = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const image = req.file;

        if (!image) {
            return res.status(400).json({ error: "Image file is required" });
        }

        const { rows: userExist } = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (userExist.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
        const fileExtension = path.extname(image.originalname).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            return res.status(400).json({ error: "Invalid image file type. Allowed: png, jpg, jpeg, webp" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const { rows } = await pool.query(
            'INSERT INTO users (name, email, password, address, phone, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, email, hashedPassword, address, phone, image.filename]
        );

        return res.status(201).json({ message: rows[0] });
    } catch (e) {
        console.error(e); // Log error for debugging
        return res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
};



const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { rows: users } = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Email not found' });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id }, "sabik", {
            expiresIn: '1h'
        });

        res.json({ token, user });

    } catch (e) {

        res.status(500).json({ e: e.message });
    }
}

// Get Profile API
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming middleware sets req.user
        const { rows: user } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user: user[0] });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// Update Profile API
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming middleware sets req.user
        const { name, address, phone } = req.body;
        const image = req.file;

        let updateQuery = 'UPDATE users SET name = $1, address = $2, phone = $3';
        const values = [name, address, phone];
        if (image) {
            updateQuery += ', image = $4';
            values.push(image.filename);
        }
        updateQuery += ' WHERE id = $5 RETURNING *';
        values.push(userId);

        const { rows } = await pool.query(updateQuery, values);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully', user: rows[0] });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports = { register, login, getProfile, updateProfile };