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

const getAllOrders = async (req, res) => {
    try {
        // Get user ID from the request object
        const user_id = req.user.id;

        // Fetch all orders for the specific user
        const ordersResult = await pool.query(`
            SELECT 
                o.id AS order_id, 
                o.user_id, 
                o.total_amount, 
                o.address, 
                o.status, 
                o.created_at,
                u.name AS user_name,
                u.email AS user_email
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.user_id = $1
            ORDER BY o.created_at DESC
        `, [user_id]);

        const orders = ordersResult.rows;

        if (orders.length === 0) {
            return res.status(200).json({
                msg: 'No orders found for this user',
                orders: [],
            });
        }

        // Fetch items for the orders
        const orderIds = orders.map(order => order.order_id);

        const itemsResult = await pool.query(`
            SELECT 
                oi.order_id, 
                oi.item_id, 
                oi.quantity, 
                oi.price,
                i.name AS item_name
            FROM order_items oi
            JOIN items i ON oi.item_id = i.id
            WHERE oi.order_id = ANY($1::int[])
        `, [orderIds]);

        const items = itemsResult.rows;

        // Combine orders with their items
        const ordersWithItems = orders.map(order => ({
            id: order.order_id,
            user: {
                id: order.user_id,
                name: order.user_name,
                email: order.user_email,
            },
            total_amount: order.total_amount,
            address: order.address,
            status: order.status,
            created_at: order.created_at,
            items: items.filter(item => item.order_id === order.order_id).map(item => ({
                id: item.item_id,
                name: item.item_name,
                quantity: item.quantity,
                price: item.price,
            })),
        }));

        res.status(200).json({
            msg: 'Orders retrieved successfully',
            orders: ordersWithItems,
        });
    } catch (err) {
        console.error('Error fetching orders:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { placeOrder,getAllOrders }