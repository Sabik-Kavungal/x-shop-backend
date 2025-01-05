const pool = require('../config/db');

const addCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;

        if (!name || !description || !image) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }
        const { rows } = await pool.query(`INSERT INTO category (name,description,image) VALUES ($1,$2,$3) RETURNING *`, [name, description, image]);

        res.status(201).json({ message: 'category added successfully', data: rows[0] });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

const getAllCategory = async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM category");
        if (rows.length === 0) {
            return res.status(404).json({ message: "No categories found" });
        }
        res.status(200).json({ data: rows });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

}

module.exports = { addCategory, getAllCategory };