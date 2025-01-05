const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const auth = async (req, res, next) => {
    try {
        const token = req.header('auth');
        if (!token) return res.status(401).json({ msg: 'No auth Token, access desied' });

        const verified = jwt.verify('sabik', token);
        if (!verified) return res.status(401).json({ msg: ' Token verification faild  ' });

        const { row: users } = await pool.query(`SELECT * FROM users WHERE id = $1`, [verified.id]);


        if (users.length === 0) {
            return res.status(404).json({ msg: 'user not found  ' });
        }

        req.user = users[0];
        req.token = token;

        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}