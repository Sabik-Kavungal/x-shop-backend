const pool = require('../config/db');


const addToCart = async (req, res) => {
    try {
        const { item_id, quantity } = req.body;
        const user_id = req.user.id;

        const { rows } = await pool.query(`SELECT * FROM carts WHERE user_id = $1 AND item_id = $2`, [user_id, item_id]);
        if (rows.length > 0) {
            const { rows } = await pool.query(`UPDATE carts SET quantity = quantity + $1 WHERE user_id = $2 AND item_id = $3`, [quantity, user_id, item_id]);

            return res.json({ message: 'cart item updated successfully', data: rows });
        }

        const newItem = await pool.query(`INSERT INTO carts (user_id,item_id,quantity) VALUES ($1,$2,$3) RETURNING *`, [user_id, item_id, quantity]);
        return res.json({ message: 'cart added successfully', data: newItem.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });

    }
}

const getAllcarts = async (req, res) => {
    try {
        const user_id = req.user.id;
        if (!user_id) {
            return res.status(400).json({ message: 'User ID is missing or user is not authenticated.' });
        }
        console.log(user_id);

        const { rows } = await pool.query(`
            SELECT carts.id AS cart_id, carts.user_id,carts.item_id,carts.quantity,items.name AS item_name, items.price AS item_price, items.image AS item_image FROM carts LEFT JOIN items ON carts.item_id = items.id WHERE carts.user_id = $1
        `, [user_id]);
        if (rows.length === 0) {
            return res.json({ message: 'no items in cart', data: [] });
        }
        res.status(200).json({ carts: rows });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}


const incrementQty = async (req, res) => {
    try {
        const { item_id, quantity } = req.body;
        const user_id = req.user.id;
        const { rows } = await pool.query(`UPDATE carts SET quantity = $1 WHERE item_id = $2 AND user_id = $3 RETURNING *`, [quantity, item_id, user_id]);

        res.json({ message: 'quantity updated successfully', data: rows[0] });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

module.exports = { addToCart, getAllcarts,incrementQty }