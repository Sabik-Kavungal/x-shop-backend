const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;

        const image = req.file;

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

        const { rows } = await pool.query('INSERT INTO users (name,email,password,address,phone,image) VALUES ( $1,$2,$3,$4,$5,$6 ) RETURNING *', [name, email, hashedPassword, address, phone, image.filename]);

        res.status(201).json({ message: rows[0] });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}


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

module.exports = { register, login };