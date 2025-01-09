const pool = require('../config/db');

// Add a new promotion banner
const addPromotionBanner = async (req, res) => {
    try {
        const { title, description, image_url, start_date, end_date } = req.body;

        if (!title || !description || !image_url || !start_date || !end_date) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const { rows } = await pool.query(
            `INSERT INTO promotion_banners (title, description, image_url, start_date, end_date) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [title, description, image_url, start_date, end_date]
        );

        res.status(201).json({ message: "Promotion banner added successfully", data: rows[0] });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// Get all promotion banners
const getAllPromotionBanners = async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM promotion_banners ORDER BY start_date ASC");
        if (rows.length === 0) {
            return res.status(404).json({ message: "No promotion banners found" });
        }
        res.status(200).json({ data: rows });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// Get a specific promotion banner by ID
const getPromotionBannerById = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query("SELECT * FROM promotion_banners WHERE id = $1", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Promotion banner not found" });
        }
        res.status(200).json({ data: rows[0] });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// Update a promotion banner
const updatePromotionBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image_url, start_date, end_date } = req.body;

        const { rows } = await pool.query(
            `UPDATE promotion_banners 
             SET title = $1, description = $2, image_url = $3, start_date = $4, end_date = $5, updated_at = NOW()
             WHERE id = $6 RETURNING *`,
            [title, description, image_url, start_date, end_date, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Promotion banner not found" });
        }

        res.status(200).json({ message: "Promotion banner updated successfully", data: rows[0] });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// Delete a promotion banner
const deletePromotionBanner = async (req, res) => {
    try {
        const { id } = req.params;

        const { rows } = await pool.query("DELETE FROM promotion_banners WHERE id = $1 RETURNING *", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Promotion banner not found" });
        }

        res.status(200).json({ message: "Promotion banner deleted successfully" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports = {
    addPromotionBanner,
    getAllPromotionBanners,
    getPromotionBannerById,
    updatePromotionBanner,
    deletePromotionBanner
};
