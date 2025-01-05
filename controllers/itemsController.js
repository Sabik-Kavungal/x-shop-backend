const pool = require('../config/db');


const addItems = async (req, res) => {
    try {
        const { name, price, description, image, category_id } = req.body;
        if (!name || !price || !description || !image || !category_id) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }
        const { rows } = await pool.query(`INSERT INTO items (name,price,description,image,category_id) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [name, price, description, image, category_id]);

        res.status(201).json({ message: "Items added successfully", data: rows[0] });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

const getAllItems = async (req, res) => {
    try {
        const { rows } = await pool.query(`SELECT items.name AS item_name, items.price AS item_price, items.description AS item_description, items.image AS item_image , category.name AS category_name FROM items LEFT JOIN category ON items.category_id = category.id`);
        res.status(200).json({ data: rows });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

module.exports = { addItems, getAllItems };