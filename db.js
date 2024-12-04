let db; // SQLite database instance
async function initDB() {
    const SQL = await initSqlJs({
      locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`,
    });
  
    // Load database from localStorage if it exists
    if (localStorage.getItem("dbFile")) {
      const dbFile = Uint8Array.from(atob(localStorage.getItem("dbFile")), c => c.charCodeAt(0));
      db = new SQL.Database(dbFile);
      console.log("Loaded database from persistent storage.");
    } else {
      db = new SQL.Database(); // Create a new database
      console.log("Initialized a new database.");
      createTable(); // Create the products table
    }
  }

  // Create Table for Products
  function createTable() {
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        barcode TEXT PRIMARY KEY,
        name TEXT,
        price TEXT
      );
    `);
    console.log("Products table created.");
  }


  function insertProducts(products) {
    const stmt = db.prepare("INSERT OR REPLACE INTO products (barcode, name, price) VALUES (?, ?, ?);");
    products.forEach(product => {
      if (product.barcode && product.name && product.price) {
        const sanitizedBarcode = product.barcode.trim();
        const sanitizedName = product.name.trim();
        const sanitizedPrice = product.price.trim();
        stmt.run([sanitizedBarcode, sanitizedName, sanitizedPrice]);
      }
    });
    stmt.free();
    saveDatabase(); // Save the database after inserting products
    console.log("Products successfully inserted and database saved.");
  }


  function getProductByBarcode(barcode) {
    const sanitizedBarcode = barcode.trim(); // Ensure the barcode is sanitized
    console.log(`Looking up barcode: "${sanitizedBarcode}"`);
    // Prepare and execute the query
    const stmt = db.prepare("SELECT barcode, name, price FROM products WHERE barcode = ?;");
    const result = stmt.get([sanitizedBarcode]);
    stmt.free();
  
    if (result) {
      // Ensure the result matches the database structure
      console.log(`Found product: ${JSON.stringify(result)}`);
      const product = {
        barcode: result["barcode"] || result[0], // Handles both named fields and indexed fields
        name: result["name"] || result[1],
        price: result["price"] || result[2],
      };
  
      // Ensure product fields are not undefined
      if (product.barcode && product.name && product.price) {
        return product; // Return the valid product object
      } else {
        console.warn(`No product found for barcode "${sanitizedBarcode}"`);
        return null; // Return null if any field is missing
      }
    } else {
      return null; // Return null if no result is found
    }
  }

  function saveDatabase() {
    const dbFile = db.export();
    localStorage.setItem("dbFile", btoa(String.fromCharCode.apply(null, dbFile)));
    console.log("Database saved to persistent storage.");
  }

  function clearTable() {
    if (db) {
        db.run("DELETE FROM products;");
        console.log("Products table cleared.");
    } else {
        console.error("Database not initialized. Cannot clear table.");
    }
}

function getProductCount() {
    const stmt = db.prepare("SELECT COUNT(*) AS count FROM products;");
    stmt.step();
    const row = stmt.getAsObject();
    stmt.free();
    return row.count || 0;
  }
  


    // Function to log all products in the SQLite database
// function logAllProducts() {
//   console.log("Logging all products in the database:");
//   const stmt = db.prepare("SELECT * FROM products;"); // Query all products
//   while (stmt.step()) {
//       console.log(stmt.getAsObject()); // Log each product as an object
//   }
//   stmt.free(); // Free the statement after use
// }


