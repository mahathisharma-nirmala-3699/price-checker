// Function to process XLSX files
function processXLSX(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const content = XLSX.utils.sheet_to_csv(sheet);
        processCSVContent(content); // Use existing CSV processing logic
    };
    reader.readAsArrayBuffer(file);
  }

  // Function to process CSV content
function processCSVContent(content) {
    const rows = content.split("\n").filter(row => row.trim()).map(row => {
        const [barcode, name, price] = row.split(",");
        if (barcode && name && price) {
            return { barcode: barcode.trim(), name: name.trim(), price: price.trim() };
        }
        console.error("Malformed row:", row);
        return null; // Skip malformed rows
    }).filter(product => product !== null); // Remove null entries
  
    insertProducts(rows); // Insert rows into SQLite database
    // logAllProducts(); // Log products for debugging
    localStorage.setItem("fileUploaded", "true"); // Set the flag in localStorage
    afterFileUpload(); // Transition to the next screen
  }


    // Process CSV File
    function processCSV(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const content = e.target.result;
          const rows = content.split("\n").filter(row => row.trim()).map(row => {
            const [barcode, name, price] = row.split(",");
            return { barcode: barcode.trim(), name: name.trim(), price: price.trim() };
          });
          insertProducts(rows);
          localStorage.setItem("fileUploaded", "true");
          afterFileUpload();
        };
        reader.readAsText(file);
      }
    
      // After File Upload Logic
    //   function afterFileUpload() {
    //     showPopup("File uploaded successfully!");
    //     document.getElementById("setup-section").style.display = "none";
    //     document.getElementById("barcode-section").style.display = "block";
    //   }

    function afterFileUpload() {
        showPopup("File uploaded successfully!");
        document.getElementById("setup-section").style.display = "none";
        document.getElementById("barcode-section").style.display = "block";
    
        // Automatically focus on the barcode input field
        const barcodeInput = document.getElementById("barcodeInput");
        if (barcodeInput) {
            barcodeInput.focus();
        } else {
            console.error("Barcode input field not found.");
        }
    }

    function capitalize(text) {
        if (!text) return ""; // Handle empty or null input
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      }