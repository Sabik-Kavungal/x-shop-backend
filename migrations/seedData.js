const pool = require('../config/db');

const seedData = async () => {
    try {


         // Insert initial categories
         const categories = [
            'Electronics',
            'Furniture',
            'Clothing',
            'Books'
        ];

        // Insert categories into the category table
        for (const category of categories) {
            await pool.query(
                'INSERT INTO category (name) VALUES ($1) ON CONFLICT DO NOTHING',
                [category]
            );
        }
        console.log('sabik seeded successfully.');


         // Insert initial items into sabik (products) table with category references
         const products = [
            { name: 'Laptop', d: 'High-end laptop', category: 'Electronics' },
            { name: 'Sofa', d: 'Comfortable 3-seater sofa', category: 'Furniture' },
            { name: 'T-shirt', d: 'Cotton t-shirt', category: 'Clothing' },
            { name: 'Programming Book', d: 'Learn Node.js programming', category: 'Books' },
            { name: 'sabik', d: 'Learn Node.js programming', category: 'Books' },
        ];

        for (const product of products) {
            // Get the category ID for each product
            const { rows } = await pool.query(
                'SELECT id FROM category WHERE name = $1',
                [product.category]
            );

            if (rows.length > 0) {
                // Insert the product with category ID
                await pool.query(
                    'INSERT INTO sabik (name, d, category_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
                    [product.name, product.d, rows[0].id]
                );
            }
        }

        console.log('Products seeded successfully.');

        process.exit(0); // Exit after seeding
    } catch (err) {
        console.error('Error seeding data:', err.message);
        process.exit(1);
    }
};


seedData();