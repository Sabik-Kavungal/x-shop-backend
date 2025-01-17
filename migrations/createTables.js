const pool = require('../config/db');

const createTables = async () => {
    try {
        // Create categories table
        await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) UNIQUE NOT NULL,
          email TEXT NOT NULL,
          password TEXT NOT NULL,
          address TEXT NOT NULL,
          phone TEXT NOT NULL,
          image TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          
        );
      `);

        //     // Add the category_id column to sabik table
        //     await pool.query(`
        //     ALTER TABLE sabik
        //     ADD COLUMN IF NOT EXISTS category_id INTEGER;
        // `);


        //     await pool.query(`
        //     ALTER TABLE sabik
        //     ADD CONSTRAINT category_fk FOREIGN KEY (category_id)
        //     REFERENCES category(id) ON DELETE SET NULL;
        // `);


        // Create categories table
        await pool.query(`
    CREATE TABLE IF NOT EXISTS category (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL
    );
`);

        // Create categories table
        await pool.query(`
        CREATE TABLE IF NOT EXISTS items (
           
        id SERIAL PRIMARY KEY,
           name VARCHAR(100) UNIQUE NOT NULL,
           price DECIMAL(10,2) NOT NULL,
           description TEXT NOT NULL,
           image TEXT NOT NULL,
           category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE CASCADE,
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        );
    `);

        // create carts table
        await pool.query(`
        CREATE TABLE IF NOT EXISTS carts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `);


        await pool.query(

            `
            CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL,
    address TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

            `
        )

        await pool.query(
            `
            
            CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL REFERENCES items(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);
`
        );


        await pool.query(`
             CREATE TABLE IF NOT EXISTS promotion_banners  (
              id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()

        ) `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS deals_of_the_day  (
                id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL REFERENCES items(id),
    discount_percentage NUMERIC(5, 2) NOT NULL, -- Discount for the deal
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()

       ) `);




        console.log('Tables created successfully.');

        process.exit(0);
    } catch (err) {
        console.error('Error creating tables:', err.message);
        process.exit(1);
    }
};


createTables();