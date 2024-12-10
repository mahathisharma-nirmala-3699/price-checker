

let db; // IndexedDB instance


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

      request.onupgradeneeded = (event) => {
          db = event.target.result;

          // Delete the old object store if it exists (since keyPath is changing)
          if (db.objectStoreNames.contains("products")) {
              db.deleteObjectStore("products");
              console.log("Old products table removed.");
          }

          // Create a new object store with `id` as the keyPath
          const store = db.createObjectStore("products", { keyPath: "id" });
          store.createIndex("barcode", "barcode", { unique: false }); // Index for barcode
          store.createIndex("name", "name", { unique: false }); // Index for name
          store.createIndex("price", "price", { unique: false }); // Index for price
          console.log("Products table created with 'id' as the primary key.");
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


function getProductByBarcode(barcode) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("products", "readonly");
        const store = transaction.objectStore("products");

        const request = store.get(barcode.trim());
        request.onsuccess = () => {
            if (request.result) {
                console.log(`Found product: ${JSON.stringify(request.result)}`);
                resolve(request.result);
            } else {
                console.warn(`No product found for barcode "${barcode}"`);
                resolve(null);
            }
        };

        request.onerror = (event) => {
            console.error("Error retrieving product:", event.target.error);
            reject(event.target.error);
        };
    });
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




