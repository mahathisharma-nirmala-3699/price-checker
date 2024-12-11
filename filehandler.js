// // Function to process XLSX files
// function processXLSX(file) {
//     const reader = new FileReader();
//     reader.onload = function (e) {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: "array" });
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];
//         const content = XLSX.utils.sheet_to_csv(sheet);
//         processCSVContent(content); // Use existing CSV processing logic
//     };
//     reader.readAsArrayBuffer(file);
//   }

//   // Function to process CSV content
// function processCSVContent(content) {
//     const rows = content.split("\n").filter(row => row.trim()).map(row => {
//         const [barcode, name, price] = row.split(",");
//         if (barcode && name && price) {
//             return { barcode: barcode.trim(), name: name.trim(), price: price.trim() };
//         }
//         console.error("Malformed row:", row);
//         return null; // Skip malformed rows
//     }).filter(product => product !== null); // Remove null entries
  
//     insertProducts(rows); // Insert rows into SQLite database
//     // logAllProducts(); // Log products for debugging
//     localStorage.setItem("fileUploaded", "true"); // Set the flag in localStorage
//     afterFileUpload(); // Transition to the next screen
//   }


//     // Process CSV File
//     function processCSV(file) {
//         const reader = new FileReader();
//         reader.onload = function (e) {
//           const content = e.target.result;
//           const rows = content.split("\n").filter(row => row.trim()).map(row => {
//             const [barcode, name, price] = row.split(",");
//             return { barcode: barcode.trim(), name: name.trim(), price: price.trim() };
//           });
//           insertProducts(rows);
//           localStorage.setItem("fileUploaded", "true");
//           afterFileUpload();
//         };
//         reader.readAsText(file);
//       }
    
//       // After File Upload Logic
//     //   function afterFileUpload() {
//     //     showPopup("File uploaded successfully!");
//     //     document.getElementById("setup-section").style.display = "none";
//     //     document.getElementById("barcode-section").style.display = "block";
//     //   }

//     function afterFileUpload() {
//         showPopup("success","File uploaded successfully!");
//         document.getElementById("setup-section").style.display = "none";
//         document.getElementById("barcode-section").style.display = "block";
    
//         // Automatically focus on the barcode input field
//         const barcodeInput = document.getElementById("barcodeInput");
//         if (barcodeInput) {
//             barcodeInput.focus();
//         } else {
//             console.error("Barcode input field not found.");
//         }
//     }

//     function capitalize(text) {
//         if (!text) return ""; // Handle empty or null input
//         return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
//       }

// Function to process XLSX files ( latest updated one 12/10 9:00 PM )
// function processXLSX(file) {
//   const reader = new FileReader();
//   reader.onload = function (e) {
//       try {
//           const data = new Uint8Array(e.target.result);
//           const workbook = XLSX.read(data, { type: "array" });
//           const sheetName = workbook.SheetNames[0];
//           const sheet = workbook.Sheets[sheetName];
//           const content = XLSX.utils.sheet_to_csv(sheet); // Convert sheet to CSV format
//           processCSVContent(content); // Process the CSV content
//       } catch (error) {
//           console.error("Error processing XLSX file:", error);
//           showPopup("error", "Failed to process the Excel file. Please ensure it's a valid file.");
//       }
//   };
//   reader.readAsArrayBuffer(file);
// }

// Function to process XLSX files
function processXLSX(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
      try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          // Apply number formatting to "Input Barcode" column
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convert sheet to JSON
          const updatedRows = rows.map((row, index) => {
              if (index === 0) return row; // Skip header row

              const inputBarcode = row[0]; // "Input Barcode" column is assumed to be the first column
              if (inputBarcode && !isNaN(inputBarcode)) {
                  row[0] = parseFloat(inputBarcode).toLocaleString("fullwide", { useGrouping: false }); // Format as number without decimals
              }
              return row;
          });

          const formattedSheet = XLSX.utils.json_to_sheet(updatedRows, { skipHeader: true }); // Recreate sheet
          const content = XLSX.utils.sheet_to_csv(formattedSheet); // Convert updated sheet to CSV
          processCSVContent(content); // Process the updated CSV content
      } catch (error) {
          console.error("Error processing XLSX file:", error);
          showPopup("error", "Failed to process the Excel file. Please ensure it's a valid file.");
      }
  };
  reader.readAsArrayBuffer(file);
}


// // Utility function to convert scientific notation to a regular number
// function convertScientificToNumber(value) {
//   if (!value) return ""; // Return empty if the value is null or undefined

//   // Check if the value is in scientific notation
//   if (/^[\d\.]+e[+-]?\d+$/i.test(value)) {
//     const number = Number(value).toFixed(0); // Convert to a whole number string
//     return number; // Return as a string
//   }

//   // Check if the value has a decimal point (e.g., 8906010000000.00)
//   if (value.includes(".")) {
//     return BigInt(value.split(".")[0]).toString(); // Remove decimal and convert to BigInt
//   }

//   return value; // Return as is if not in scientific or decimal format
// }

// function convertScientificToNumber(value) {
//   if (!value || typeof value !== "string") return null; // Return null for null, undefined, or non-string values

//   // Check if the value is in scientific notation
//   if (/^[\d\.]+e[+-]?\d+$/i.test(value)) {
//     const number = Number(value).toFixed(0); // Convert to a whole number string
//     return number; // Return as a string
//   }

//   // Check if the value is a valid numeric string (not in scientific notation)
//   if (/^\d+(\.\d+)?$/.test(value)) {
//     return BigInt(value.split(".")[0]).toString(); // Remove decimal and convert to a BigInt string
//   }

//   return null; // Return null for invalid barcodes
// }


// Function to process CSV content
// function processCSVContent(content) {
//   try {
//       const rows = content
//           .split("\n")
//           .filter(row => row.trim()) // Filter out empty rows
//           .map(row => {
//               const [barcode, name, price] = row.split(",");
//               if (barcode && name && price) {
//                   return {
//                       id: generatePrimaryKey(), // Add a unique primary key
//                       barcode: barcode.trim(),
//                       name: capitalize(name.trim()), // Capitalize product name
//                       price: price.trim(),
//                   };
//               } else {
//                   console.error("Malformed row:", row);
//                   return null; // Skip malformed rows
//               }
//           })
//           .filter(product => product !== null); // Remove null entries

//       insertProducts(rows); // Insert rows into the database
//       localStorage.setItem("fileUploaded", "true"); // Set the upload flag
//       afterFileUpload(); // Transition to the next screen
//   } catch (error) {
//       console.error("Error processing CSV content:", error);
//       showPopup("error", "Failed to process the CSV content.");
//   }
// }
// function processCSVContent(content) {
//   try {
//       const rows = content
//           .split("\n")
//           .filter(row => row.trim()) // Filter out empty rows
//           .map(row => {
//               const [barcode, name, price] = row.split(",");
//               if (name && price) {
//                   return {
//                       id: generatePrimaryKey(), // Generate a unique primary key
//                       barcode: barcode ? barcode.trim() : null, // Optional barcode
//                       name: capitalize(name.trim()), // Capitalize product name
//                       price: price.trim(),
//                   };
//               } else {
//                   console.error("Malformed row:", row);
//                   return null; // Skip malformed rows
//               }
//           })
//           .filter(product => product !== null); // Remove null entries

//       insertProducts(rows); // Insert rows into the database
//       localStorage.setItem("fileUploaded", "true"); // Set the upload flag
//       afterFileUpload(); // Transition to the next screen
//   } catch (error) {
//       console.error("Error processing CSV content:", error);
//       showPopup("error", "Failed to process the CSV content.");
//   }
// }
// function processCSVContent(content) {
//   try {
//     const rows = content
//       .split("\n")
//       .filter((row) => row.trim()) // Filter out empty rows
//       .map((row, index) => {
//         const columns = row.split(",");

//         // Skip the header row (index 0) if applicable
//         if (index === 0) {
//           console.log("Header row:", columns);
//           return null;
//         }

//         const barcode = columns[0]?.trim(); // Column 0: Barcode
//         const productName = columns[1]?.trim(); // Column 1: Product Name
//         const price = columns[2]?.trim(); // Column 2: Price

//         if (productName && price) {
//           return {
//             id: generatePrimaryKey(), // Generate unique primary key
//             barcode: barcode, // Empty if not provided
//             name: capitalize(productName),
//             price: price,
//           };
//         } else {
//           console.warn("Malformed row skipped:", row);
//           return null; // Skip rows with missing name or price
//         }
//       })
//       .filter((product) => product !== null); // Remove null entries (malformed rows)

//     console.log("Parsed rows:", rows);

//     insertProducts(rows); // Insert rows into the database
//     localStorage.setItem("fileUploaded", "true"); // Set the upload flag
//     afterFileUpload(); // Transition to the next screen
//   } catch (error) {
//     console.error("Error processing CSV content:", error);
//     showPopup("error", "Failed to process the CSV content.");
//   }
// }

// Function to process CSV content
// function processCSVContent(content) {
//   try {
//     const rows = content
//       .split("\n")
//       .filter((row) => row.trim()) // Remove empty rows
//       .map((row, index) => {
//         const columns = row.split(",");

//         // Skip the header row (index 0)
//         if (index === 0) {
//           console.log("Header row detected:", columns);
//           return null;
//         }

//         const barcode = columns[0]?.trim();
//         const sanitizedBarcode = isNaN(Number(barcode)) || barcode === "" ? null : String(BigInt(barcode)); // Convert scientific notation to string

//         // const barcode = columns[0] ? String(columns[0].trim()) : ""; // Ensure barcode is always a string
//         const productName = columns[1]?.trim() || ""; // Column 1: Product Name
//         const price = columns[2]?.trim() || ""; // Column 2: Price

//         if (productName && price) {
//           return {
//             id: generatePrimaryKey(), // Generate unique primary key
//             barcode: sanitizedBarcode || "", // Barcode can be empty
//             name: capitalize(productName), // Capitalize product name
//             price: price,
//           };
//         } else {
//           console.warn("Skipping malformed row:", row);
//           return null; // Skip rows missing critical data
//         }
//       })
//       .filter((product) => product !== null); // Remove null rows

//     console.log("Parsed products:", rows);

//     insertProducts(rows); // Insert rows into IndexedDB
//     localStorage.setItem("fileUploaded", "true"); // Flag upload completion
//     afterFileUpload(); // Transition to next screen
//   } catch (error) {
//     console.error("Error processing CSV content:", error);
//     showPopup("error", "Failed to process the file.");
//   }
// }
const convertScientificToNumber = (barcode) => {
try {
    if (!barcode || barcode.trim() === "") return null; // Handle empty or null barcodes

    const sanitizedBarcode = barcode.trim();

    // Detect scientific notation
    const isScientific = /\d+\.?\d*e[+-]?\d+/i.test(sanitizedBarcode);
    if (isScientific) {
        // Use `Number` for scientific notation and convert it to a string
        const preciseValue = Number(sanitizedBarcode).toLocaleString("fullwide", { useGrouping: false });
        return preciseValue;
    }

    // If numeric, ensure it is converted to a string without losing leading zeros
    if (!isNaN(Number(sanitizedBarcode))) {
        return sanitizedBarcode; // Return as is if it's already a valid number string
    }

    // If non-numeric or invalid, return null
    console.warn("Invalid barcode format detected:", barcode);
    return null;
} catch (error) {
    console.error("Error converting barcode:", barcode, error);
    return null;
}
};
// commented out today (12/10/2024 9:50 pm )
// function processCSVContent(content) {
//   try {
//       const rows = content
//           .split("\n")
//           .filter((row) => row.trim()) // Remove empty rows
//           .map((row, index) => {
//               const columns = row.split(",");

//               // Skip the header row (index 0)
//               if (index === 0) {
//                   console.log("Header row detected:", columns);
//                   return null;
//               }

//               const rawBarcode = columns[0]?.trim(); // Column 0: Barcode (raw input)
//               const barcode = convertScientificToNumber(rawBarcode); // Convert barcode
//               const productName = columns[1]?.trim() || ""; // Column 1: Product Name
//               const price = columns[2]?.trim() || ""; // Column 2: Price

//               if (productName && price) {
//                   return {
//                       id: generatePrimaryKey(), // Generate unique primary key
//                       barcode: barcode || null, // Barcode can be null if invalid
//                       name: capitalize(productName), // Capitalize product name
//                       price: price,
//                   };
//               } else {
//                   console.warn("Skipping malformed row:", row);
//                   return null; // Skip rows missing critical data
//               }
//           })
//           .filter((product) => product !== null); // Remove null rows

//       console.log("Parsed products:", rows);

//       insertProducts(rows); // Insert rows into IndexedDB
//       localStorage.setItem("fileUploaded", "true"); // Flag upload completion
//       afterFileUpload(); // Transition to next screen
//   } catch (error) {
//       console.error("Error processing CSV content:", error);
//       showPopup("error", "Failed to process the file.");
//   }
// // }


// new @ 10:03 PM -> working code with extra // 


// function processCSVContent(content) {
//     try {
//       const rows = content
//         .split("\n")
//         .filter((row) => row.trim()) // Remove empty rows
//         .map((row, index) => {
//           const columns = row.split(",");

//           // Skip the header row (index 0)
//           if (index === 0) {
//             console.log("Header row detected:", columns);
//             return null;
//           }

//           // Extract relevant columns based on file structure
//           let rawBarcode, productName, price;

//           if (columns.length === 3) {
//             // Original file structure: [Barcode, Product Name, Price]
//             rawBarcode = columns[0]?.trim(); // Column 0: Barcode (raw input)
//             productName = columns[1]?.trim() || ""; // Column 1: Product Name
//             price = columns[2]?.trim() || ""; // Column 2: Price
//           } else if (columns.length >= 13) {
//             // Enhanced file structure: Extract specific columns
//             rawBarcode = columns[9]?.trim(); // Column 9: Barcode
//             productName = columns[1]?.trim() || ""; // Column 1: Product Name
//             price = columns[4]?.trim() || ""; // Column 4: Price
//           } else {
//             console.warn("Skipping malformed row due to unexpected column structure:", row);
//             return null; // Skip rows with unexpected structure
//           }

//           // Convert barcode (scientific format or invalid)
//           const barcode = convertScientificToNumber(rawBarcode);

//           if (productName && price) {
//             return {
//               id: generatePrimaryKey(), // Generate unique primary key
//               barcode: barcode || null, // Barcode can be null if invalid
//               name: capitalize(productName), // Capitalize product name
//               price: price,
//             };
//           } else {
//             console.warn("Skipping malformed row:", row);
//             return null; // Skip rows missing critical data
//           }
//         })
//         .filter((product) => product !== null); // Remove null rows

//       console.log("Parsed products:", rows);

//       insertProducts(rows); // Insert rows into IndexedDB
//       localStorage.setItem("fileUploaded", "true"); // Flag upload completion
//       afterFileUpload(); // Transition to next screen
//     } catch (error) {
//       console.error("Error processing CSV content:", error);
//       showPopup("error", "Failed to process the file.");
//     }
//   }

function processCSVContent(content) {
  try {
    const rows = content
      .split("\n")
      .filter((row) => row.trim()) // Remove empty rows
      .map((row, index) => {
        const columns = row.split(",");

        // Skip the header row (index 0)
        if (index === 0) {
          console.log("Header row detected:", columns);
          return null;
        }

        // Extract relevant columns
        let rawBarcode, productName, price;

        if (columns.length === 3) {
          // Original file structure: [Barcode, Product Name, Price]
          rawBarcode = columns[0]?.trim();
          productName = columns[1]?.trim() || "";
          price = columns[2]?.trim() || "";
        } else if (columns.length >= 13) {
          // Enhanced file structure: Extract specific columns
          rawBarcode = columns[9]?.trim(); // Column 9: Barcode
          productName = columns[1]?.trim() || ""; // Column 1: Product Name
          price = columns[4]?.trim() || ""; // Column 4: Price
        } else {
          console.warn("Skipping malformed row due to unexpected column structure:", row);
          return null;
        }

        // Convert barcode (scientific format or invalid)
        const barcode = convertScientificToNumber(rawBarcode);

        // Sanitize the product name
        productName = sanitizeProductName(productName);

        if (productName && price) {
          return {
            id: generatePrimaryKey(), // Generate unique primary key
            barcode: barcode || null, // Barcode can be null if invalid
            name: capitalize(productName), // Capitalize product name
            price: price,
          };
        } else {
          console.warn("Skipping malformed row:", row);
          return null; // Skip rows missing critical data
        }
      })
      .filter((product) => product !== null); // Remove null rows

    console.log("Parsed products:", rows);

    insertProducts(rows); // Insert rows into IndexedDB
    localStorage.setItem("fileUploaded", "true"); // Flag upload completion
    afterFileUpload(); // Transition to next screen
  } catch (error) {
    console.error("Error processing CSV content:", error);
    showPopup("error", "Failed to process the file.");
  }
}
function sanitizeProductName(name) {
  if (!name) return "";

  // Remove leading and trailing quotes and escape characters
  return name.replace(/^"|"$/g, "").replace(/\\"/g, '"');
}
  

function generatePrimaryKey() {
return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Function to process CSV file
function processCSV(file) {
const reader = new FileReader();
reader.onload = function (e) {
    try {
        const content = e.target.result;
        processCSVContent(content); // Reuse the CSV content processing logic
    } catch (error) {
        console.error("Error processing CSV file:", error);
        showPopup("error", "Failed to process the CSV file.");
    }
};
reader.readAsText(file);
}

// After File Upload Logic
function afterFileUpload() {
showPopup("success", "File uploaded successfully!");
const setupSection = document.getElementById("setup-section");
const barcodeSection = document.getElementById("barcode-section");

if (setupSection) setupSection.style.display = "none";
if (barcodeSection) barcodeSection.style.display = "block";

// Automatically focus on the barcode input field
const barcodeInput = document.getElementById("barcodeInput");
if (barcodeInput) {
    barcodeInput.focus();
} else {
    console.error("Barcode input field not found.");
}
}

// Utility function to capitalize text
function capitalize(text) {
if (!text) return ""; // Handle empty or null input
return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Utility function to generate a random primary key
function generatePrimaryKey() {
return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
