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

const getBycategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query("SELECT * FROM category WHERE id = $1", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ data: rows[0] });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image } = req.body;

        const { rows } = await pool.query(`UPDATE category SET name = $1, description = $2, image = $3 WHERE id = $4 RETURNING *`, [name, description, image, id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category updated successfully", data: rows[0] });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('DELETE FROM category WHERE id = $1 RETURNING *', [id]);
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

// Fetch all items by category
const getItemsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params; // Get category ID from request parameters

        // Query database for items in the given category
        const { rows } = await pool.query(
            `SELECT items.id, items.name, items.price, items.description, items.image, items.category_id, category.name AS category_name 
             FROM items 
             LEFT JOIN category ON items.category_id = category.id 
             WHERE items.category_id = $1`, [categoryId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "No items found for this category" });
        }

        res.status(200).json({ data: rows });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};



module.exports = { addCategory, getAllCategory, getBycategory, updateCategory, deleteCategory,getItemsByCategory };