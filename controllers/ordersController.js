const pool = require('../config/db');

const placeOrder = async (req, res) => {
    try {
        const { items, total_amount, address } = req.body;
        const user_id = req.user.id;

        // Validate input
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ msg: 'Items are required' });
        }
        if (!total_amount || !address) {
            return res.status(400).json({ msg: 'Total price and address are required' });
        }

        // Insert new order
        const orderResult = await pool.query(
            `INSERT INTO orders (user_id, total_amount, address, status, created_at) 
             VALUES ($1, $2, $3, $4, NOW()) RETURNING id`,
            [user_id, total_amount, address, 'Pending']
        );
        const orderId = orderResult.rows[0].id;

        // Insert order items
        const itemInsertQueries = items.map((item) => {
            const { item_id, quantity, price } = item;
            return pool.query(
                `INSERT INTO order_items (order_id, item_id, quantity, price) 
                 VALUES ($1, $2, $3, $4)`,
                [orderId, item_id, quantity, price]
            );
        });

        await Promise.all(itemInsertQueries);

        // Clear items from user's cart
        await pool.query(
            'DELETE FROM carts WHERE user_id = $1 AND item_id = ANY($2::int[])',
            [user_id, items.map((item) => item.item_id)]
        );

        res.status(201).json({
            msg: 'Order placed successfully',
            order: {
                id: orderId,
                total_amount,
                address,
                status: 'Pending',
                items,
                created_at: new Date().toISOString(),
            },
        });
    } catch (err) {
        console.error('Error placing order:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { placeOrder }