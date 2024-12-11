// let db; // SQLite database instance
// async function initDB() {
//     const SQL = await initSqlJs({
//       locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`,
//     });
  
//     // Load database from localStorage if it exists
//     if (localStorage.getItem("dbFile")) {
//       const dbFile = Uint8Array.from(atob(localStorage.getItem("dbFile")), c => c.charCodeAt(0));
//       db = new SQL.Database(dbFile);
//       console.log("Loaded database from persistent storage.");
//     } else {
//       db = new SQL.Database(); // Create a new database
//       console.log("Initialized a new database.");
//       createTable(); // Create the products table
//     }
//   }

//   // Create Table for Products
//   function createTable() {
//     db.run(`
//       CREATE TABLE IF NOT EXISTS products (
//         barcode TEXT PRIMARY KEY,
//         name TEXT,
//         price TEXT
//       );
//     `);
//     console.log("Products table created.");
//   }


//   function insertProducts(products) {
//     console.log("Total products to insert:", products.length); // Log the total number of products

//     const BATCH_SIZE = 100; // Adjust batch size as needed
//     const stmt = db.prepare("INSERT OR REPLACE INTO products (barcode, name, price) VALUES (?, ?, ?);");

//     let currentIndex = 0;

//     function insertBatch() {
//         const batch = products.slice(currentIndex, currentIndex + BATCH_SIZE);
//         batch.forEach(product => {
//             if (product.barcode && product.name && product.price) {
//                 const sanitizedBarcode = product.barcode.trim();
//                 const sanitizedName = product.name.trim();
//                 const sanitizedPrice = product.price.trim();
//                 stmt.run([sanitizedBarcode, sanitizedName, sanitizedPrice]);
//             }
//         });

//         currentIndex += BATCH_SIZE;

//         if (currentIndex < products.length) {
//             console.log(`Processed ${currentIndex} / ${products.length} products`); // Log progress
//             setTimeout(insertBatch, 0); // Defer to prevent blocking the UI
//         } else {
//             stmt.free();
//             console.log("All products inserted successfully.");
//             saveDatabase(); // Save the database only once after all batches
//         }
//     }

//     insertBatch();
// }




//   function getProductByBarcode(barcode) {
//     const sanitizedBarcode = barcode.trim(); // Ensure the barcode is sanitized
//     console.log(`Looking up barcode: "${sanitizedBarcode}"`);
//     // Prepare and execute the query
//     const stmt = db.prepare("SELECT barcode, name, price FROM products WHERE barcode = ?;");
//     const result = stmt.get([sanitizedBarcode]);
//     stmt.free();
  
//     if (result) {
//       // Ensure the result matches the database structure
//       console.log(`Found product: ${JSON.stringify(result)}`);
//       const product = {
//         barcode: result["barcode"] || result[0], // Handles both named fields and indexed fields
//         name: result["name"] || result[1],
//         price: result["price"] || result[2],
//       };
  
//       // Ensure product fields are not undefined
//       if (product.barcode && product.name && product.price) {
//         return product; // Return the valid product object
//       } else {
//         console.warn(`No product found for barcode "${sanitizedBarcode}"`);
//         return null; // Return null if any field is missing
//       }
//     } else {
//       return null; // Return null if no result is found
//     }
//   }



//   function saveDatabase() {
//     try {
//         console.log("Exporting database...");
//         const dbFile = db.export(); // Export the database file
//         const dbFileBase64 = btoa(String.fromCharCode.apply(null, dbFile));
//         localStorage.setItem("dbFile", dbFileBase64); // Save it to localStorage
//         console.log("Database saved to persistent storage.");
//     } catch (error) {
//         console.error("Error exporting database:", error);
//     }
// }


// function validateAndFormatProducts(products) {
//   return products.map(product => ({
//       barcode: String(product.barcode).trim(),
//       name: String(product.name).trim(),
//       price: String(product.price).trim(),
//   }));
// }



//   function clearTable() {
//     if (db) {
//         db.run("DELETE FROM products;");
//         console.log("Products table cleared.");
//     } else {
//         console.error("Database not initialized. Cannot clear table.");
//     }
// }

// function getProductCount() {
//     const stmt = db.prepare("SELECT COUNT(*) AS count FROM products;");
//     stmt.step();
//     const row = stmt.getAsObject();
//     stmt.free();
//     return row.count || 0;
//   }
  

let db; // IndexedDB instance

// async function initDB() {
//     return new Promise((resolve, reject) => {
//         const request = indexedDB.open("PriceCheckerDB", 1);

//         request.onerror = (event) => {
//             console.error("Error initializing IndexedDB:", event.target.error);
//             reject(event.target.error);
//         };

//         request.onsuccess = (event) => {
//             db = event.target.result;
//             console.log("IndexedDB initialized successfully.");
//             resolve();
//         };

//         request.onupgradeneeded = (event) => {
//             db = event.target.result;
//             if (!db.objectStoreNames.contains("products")) {
//                 const store = db.createObjectStore("products", { keyPath: "barcode" });
//                 store.createIndex("name", "name", { unique: false });
//                 store.createIndex("price", "price", { unique: false });
//                 console.log("Products table created in IndexedDB.");
//             }
//         };
//     });
// }

// async function initDB() {
//   return new Promise((resolve, reject) => {
//       const request = indexedDB.open("PriceCheckerDB", 1);

//       request.onerror = (event) => {
//           console.error("Error initializing IndexedDB:", event.target.error);
//           reject(event.target.error);
//       };

//       request.onsuccess = (event) => {
//           db = event.target.result;
//           console.log("IndexedDB initialized successfully.");
//           resolve();
//       };

//       request.onupgradeneeded = (event) => {
//           db = event.target.result;

//           if (!db.objectStoreNames.contains("products")) {
//               const store = db.createObjectStore("products", { keyPath: "id" }); // Use 'id' as the primary key
//               store.createIndex("barcode", "barcode", { unique: false }); // Index for barcode
//               store.createIndex("name", "name", { unique: false }); // Index for name
//               store.createIndex("price", "price", { unique: false }); // Index for price
//               console.log("Products table created in IndexedDB.");
//           }
//       };
//   });
// }

// async function initDB() {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open("PriceCheckerDB", 1);

//     request.onerror = (event) => {
//       console.error("Error initializing IndexedDB:", event.target.error);
//       reject(event.target.error);
//     };

//     request.onsuccess = (event) => {
//       db = event.target.result;
//       console.log("IndexedDB initialized successfully.");
//       resolve();
//     };

//     request.onupgradeneeded = (event) => {
//       db = event.target.result;
//       if (!db.objectStoreNames.contains("products")) {
//         const store = db.createObjectStore("products", { keyPath: "id" }); // Use `id` as primary key
//         store.createIndex("barcode", "barcode", { unique: false });
//         store.createIndex("name", "name", { unique: false });
//         store.createIndex("price", "price", { unique: false });
//         console.log("Products table created in IndexedDB.");
//       }
//     };
//   });
// }

async function initDB() {
  return new Promise((resolve, reject) => {
      const request = indexedDB.open("PriceCheckerDB", 2); // Increment the version number to apply schema changes

      request.onerror = (event) => {
          console.error("Error initializing IndexedDB:", event.target.error);
          reject(event.target.error);
      };

      request.onsuccess = (event) => {
          db = event.target.result;
          console.log("IndexedDB initialized successfully.");
          resolve();
      };

      // request.onupgradeneeded = (event) => {
      //     db = event.target.result;

      //     // Delete the old object store if it exists (since keyPath is changing)
      //     if (db.objectStoreNames.contains("products")) {
      //         db.deleteObjectStore("products");
      //         console.log("Old products table removed.");
      //     }

      //     // Create a new object store with `id` as the keyPath
      //     const store = db.createObjectStore("products", { keyPath: "id" });
      //     store.createIndex("barcode", "barcode", { unique: false }); // Index for barcode
      //     store.createIndex("name", "name", { unique: false }); // Index for name
      //     store.createIndex("price", "price", { unique: false }); // Index for price
      //     console.log("Products table created with 'id' as the primary key.");
      // };
      request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains("products")) {
            const store = db.createObjectStore("products", { keyPath: "id" }); // Use "id" as primary key
            store.createIndex("barcode", "barcode", { unique: false }); // Create index for barcode
            console.log("Products table created in IndexedDB.");
        }
    };
  });
}



function createTable() {
    console.log("Products table is created in IndexedDB during initialization.");
    // No further action needed; handled in `initDB`.
}

// function insertProducts(products) {
//   console.log("Total products to insert:", products.length); // Log the total number of products

//   const BATCH_SIZE = 100; // Adjust batch size as needed
//   let currentIndex = 0;

//   function insertBatch() {
//       // Create a new transaction for each batch
//       const transaction = db.transaction("products", "readwrite");
//       const objectStore = transaction.objectStore("products");

//       const batch = products.slice(currentIndex, currentIndex + BATCH_SIZE);
//       batch.forEach(product => {
//           if (product.barcode && product.name && product.price) {
//               const sanitizedProduct = {
//                   barcode: String(product.barcode).trim(),
//                   name: String(product.name).trim(),
//                   price: String(product.price).trim(),
//               };
//               objectStore.put(sanitizedProduct); // Add the product to the object store
//           }
//       });

//       transaction.oncomplete = () => {
//         currentIndex += BATCH_SIZE;
//         console.log(`Processed ${currentIndex} / ${products.length} products`); // Log progress

//         if (currentIndex < products.length) {
//             setTimeout(insertBatch, 0); // Defer to prevent blocking the UI
//         } else {
//             // Once all batches are processed, log the total count in the database
//             getProductCount().then(count => {
//                 console.log(`All products inserted successfully. Total products in DB: ${count}`);
//             });
//         }
//     };

//       transaction.onerror = (event) => {
//           console.error("Transaction error:", event.target.error);
//       };
//   }

//   insertBatch();
// }

// function insertProducts(products) {
//   console.log("Total products to insert:", products.length); // Log the total number of products

//   const BATCH_SIZE = 100; // Adjust batch size as needed
//   let currentIndex = 0;

//   function insertBatch() {
//       const transaction = db.transaction("products", "readwrite");
//       const objectStore = transaction.objectStore("products");

//       const batch = products.slice(currentIndex, currentIndex + BATCH_SIZE);
//       batch.forEach(product => {
//           const sanitizedProduct = {
//               id: product.id || generatePrimaryKey(), // Use provided id or generate a new one
//               barcode: product.barcode ? String(product.barcode).trim() : null, // Optional barcode
//               name: String(product.name).trim(),
//               price: String(product.price).trim(),
//           };
//           objectStore.put(sanitizedProduct); // Insert or update the product
//       });

//       transaction.oncomplete = () => {
//           currentIndex += BATCH_SIZE;
//           console.log(`Processed ${currentIndex} / ${products.length} products`); // Log progress

//           if (currentIndex < products.length) {
//               setTimeout(insertBatch, 0); // Defer to prevent blocking the UI
//           } else {
//               getProductCount().then(count => {
//                   console.log(`All products inserted successfully. Total products in DB: ${count}`);
//               });
//           }
//       };

//       transaction.onerror = (event) => {
//           console.error("Transaction error:", event.target.error);
//       };
//   }

//   insertBatch();
// }

function insertProducts(products) {
  console.log("Total products to insert:", products.length);

  const BATCH_SIZE = 100; // Adjust batch size if needed
  let currentIndex = 0;

  function insertBatch() {
    const transaction = db.transaction("products", "readwrite");
    const objectStore = transaction.objectStore("products");

    const batch = products.slice(currentIndex, currentIndex + BATCH_SIZE);
    batch.forEach((product) => {
      objectStore.put(product); // Add product to the object store
    });

    transaction.oncomplete = () => {
      currentIndex += BATCH_SIZE;
      console.log(`Processed ${currentIndex} / ${products.length} products`);

      if (currentIndex < products.length) {
        setTimeout(insertBatch, 0); // Defer to avoid UI blocking
      } else {
        getProductCount().then((count) => {
          console.log(`All products inserted successfully. Total products in DB: ${count}`);
        });
      }
    };

    transaction.onerror = (event) => {
      console.error("Transaction error:", event.target.error);
    };
  }

  insertBatch();
}



// Function to get product count
function getProductCount() {
  return new Promise((resolve, reject) => {
      const transaction = db.transaction("products", "readonly");
      const store = transaction.objectStore("products");
      const countRequest = store.count();

      countRequest.onsuccess = () => {
          resolve(countRequest.result);
      };

      countRequest.onerror = () => {
          reject("Failed to count products in the database.");
      };
  });
}


// function getProductByBarcode(barcode) {
//     return new Promise((resolve, reject) => {
//         const transaction = db.transaction("products", "readonly");
//         const store = transaction.objectStore("products");

//         const request = store.get(barcode.trim());
//         request.onsuccess = () => {
//             if (request.result) {
//                 console.log(`Found product: ${JSON.stringify(request.result)}`);
//                 resolve(request.result);
//             } else {
//                 console.warn(`No product found for barcode "${barcode}"`);
//                 resolve(null);
//             }
//         };

//         request.onerror = (event) => {
//             console.error("Error retrieving product:", event.target.error);
//             reject(event.target.error);
//         };
//     });
// }

function getProductByBarcode(barcode) {
  return new Promise((resolve, reject) => {
    logAllProducts();
      const sanitizedBarcode = String(barcode).trim(); // Ensure the barcode is sanitized
      console.log("Looking up sanitized barcode:", sanitizedBarcode);

      const transaction = db.transaction("products", "readonly");
      const store = transaction.objectStore("products");
      const index = store.index("barcode"); // Use the barcode index
      const request = index.get(sanitizedBarcode); // Query using the index
      console.log("IndexedDB request object:", request);

      request.onsuccess = () => {
          if (request.result) {
              console.log("Found product:", JSON.stringify(request.result));
              resolve(request.result);
          } else {
              console.warn("No product found for barcode:", sanitizedBarcode);
              resolve(null);
          }
      };

      request.onerror = (event) => {
          console.error("Error retrieving product:", event.target.error);
          reject(event.target.error);
      };
  });
}

function logAllProducts() {
  const transaction = db.transaction("products", "readonly");
  const store = transaction.objectStore("products");
  const request = store.getAll();

  request.onsuccess = () => {
      console.log("All products in the database:", request.result);
  };

  request.onerror = (event) => {
      console.error("Error retrieving all products:", event.target.error);
  };
}



function saveDatabase() {
    // Not needed for IndexedDB as it is already persisted.
    console.log("IndexedDB persists data automatically. No manual save required.");
}

function clearTable() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("products", "readwrite");
        const store = transaction.objectStore("products");

        const clearRequest = store.clear();
        clearRequest.onsuccess = () => {
            console.log("Products table cleared.");
            resolve();
        };

        clearRequest.onerror = (event) => {
            console.error("Error clearing table:", event.target.error);
            reject(event.target.error);
        };
    });
}

function getProductCount() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("products", "readonly");
        const store = transaction.objectStore("products");

        const countRequest = store.count();
        countRequest.onsuccess = () => {
            console.log(`Product count: ${countRequest.result}`);
            resolve(countRequest.result);
        };

        countRequest.onerror = (event) => {
            console.error("Error counting products:", event.target.error);
            reject(event.target.error);
        };
    });
}

function validateAndFormatProducts(products) {
    return products.map((product) => ({
        barcode: String(product.barcode).trim(),
        name: String(product.name).trim(),
        price: String(product.price).trim(),
    }));
}




