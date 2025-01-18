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

        // Construct the full URL for the image
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${image.filename}`;

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: rows[0].id,
                name: rows[0].name,
                email: rows[0].email,
                address: rows[0].address,
                phone: rows[0].phone,
                image: imageUrl, // Include the full image URL
            }
        });
    } catch (e) {
        console.error(e); // Log error for debugging
        return res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Debugging: Log incoming email
        console.log("Login attempt with email:", email);

        const { rows: users } = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

        // Debugging: Log database response
        console.log("Database response:", users);

        if (!users || users.length === 0) {
            return res.status(400).json({ message: 'Email not found' });
        }

        const user = users[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate token
        const token = jwt.sign({ id: user.id }, "sabik", {
            expiresIn: '1h',
        });

        res.json({ token, user });
    } catch (e) {
        console.error("Login error:", e.message);
        res.status(500).json({ e: e.message });
    }
};

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
// Update Profile API
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming middleware sets req.user
        const { name, address, phone } = req.body;
        const image = req.file;

        // Validate inputs
        if (!name && !address && !phone && !image) {
            return res.status(400).json({ message: 'Nothing to update' });
        }

        // If an image is provided, validate its type
        let imageUrl = null;
        if (image) {
            const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
            const fileExtension = path.extname(image.originalname).toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                return res.status(400).json({ error: "Invalid image file type. Allowed: png, jpg, jpeg, webp" });
            }

            imageUrl = `${req.protocol}://${req.get('host')}/uploads/${image.filename}`;
        }

        // Build the update query dynamically
        const updates = [];
        const values = [];
        let index = 1;

        if (name !== undefined) {
            updates.push(`name = $${index++}`);
            values.push(name);
        }

        if (address !== undefined) {
            updates.push(`address = $${index++}`);
            values.push(address);
        }

        if (phone !== undefined) {
            updates.push(`phone = $${index++}`);
            values.push(phone);
        }

        if (imageUrl !== null) {
            updates.push(`image = $${index++}`);
            values.push(image.filename);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'Nothing to update' });
        }

        values.push(userId);

        // Execute the update query
        const { rowCount } = await pool.query(
            `UPDATE users SET ${updates.join(", ")} WHERE id = $${index} RETURNING *`,
            values
        );

        if (rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch the updated user data
        const { rows: updatedUser } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser[0].id,
                name: updatedUser[0].name,
                email: updatedUser[0].email,
                address: updatedUser[0].address,
                phone: updatedUser[0].phone,
                image: imageUrl || (updatedUser[0].image ? `${req.protocol}://${req.get('host')}/uploads/${updatedUser[0].image}` : null),
            },
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
};
module.exports = { register, login, getProfile, updateProfile };