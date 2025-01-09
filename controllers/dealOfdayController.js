const pool = require('../config/db');

// Add a new deal
const addDealOfTheDay = async (req, res) => {
    try {
        const { item_id, discount_percentage, start_date, end_date } = req.body;

        if (!item_id || !discount_percentage || !start_date || !end_date) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const { rows } = await pool.query(
            `INSERT INTO deals_of_the_day (item_id, discount_percentage, start_date, end_date) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [item_id, discount_percentage, start_date, end_date]
        );

        res.status(201).json({ message: "Deal of the Day added successfully", data: rows[0] });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// Get all deals
const getAllDealsOfTheDay = async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT d.id, d.item_id, p.name AS product_name, p.price, 
                   d.discount_percentage, d.start_date, d.end_date
            FROM deals_of_the_day d
            JOIN items p ON d.item_id = p.id
            ORDER BY d.start_date ASC
        `);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No deals found" });
        }

        res.status(200).json({ data: rows });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// Get a specific deal by ID
const getDealOfTheDayById = async (req, res) => {
    try {
        const { id } = req.params;

        const { rows } = await pool.query(
            `SELECT d.id, d.item_id, p.name AS product_name, p.price, 
                    d.discount_percentage, d.start_date, d.end_date
             FROM deals_of_the_day d
             JOIN items p ON d.item_id = p.id
             WHERE d.id = $1`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Deal not found" });
        }

        res.status(200).json({ data: rows[0] });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// Update a deal
const updateDealOfTheDay = async (req, res) => {
    try {
        const { id } = req.params;
        const { item_id, discount_percentage, start_date, end_date } = req.body;

        const { rows } = await pool.query(
            `UPDATE deals_of_the_day 
             SET item_id = $1, discount_percentage = $2, start_date = $3, end_date = $4, updated_at = NOW()
             WHERE id = $5 RETURNING *`,
            [item_id, discount_percentage, start_date, end_date, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Deal not found" });
        }

        res.status(200).json({ message: "Deal updated successfully", data: rows[0] });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// Delete a deal
const deleteDealOfTheDay = async (req, res) => {
    try {
        const { id } = req.params;

        const { rows } = await pool.query("DELETE FROM deals_of_the_day WHERE id = $1 RETURNING *", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Deal not found" });
        }

        res.status(200).json({ message: "Deal deleted successfully" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports = {
    addDealOfTheDay,
    getAllDealsOfTheDay,
    getDealOfTheDayById,
    updateDealOfTheDay,
    deleteDealOfTheDay
};
