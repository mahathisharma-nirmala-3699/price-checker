
// let db; // SQLite database instance
const DEFAULT_AUTH_CODE = "12345"; // Default initial authorization code
let barcodeInputTimeout = null; // Timeout variable for debounce mechanism
let isManualInput = false;
let lastInputTime = 0; // To differentiate between manual and scanned input
const SCAN_THRESHOLD = 150; // Time in milliseconds for scan detection
let isScanning = false; 


document.addEventListener("DOMContentLoaded", async () => {

  const barcodeInput = document.getElementById("barcodeInput");
  if (!barcodeInput) {
    console.error("Barcode input field not found.");
    return;
  }
  await initDB(); // Initialize SQLite database
 

  // Check if there are products in the database
  const productCount = getProductCount();
  if (productCount > 0) {
    // If products exist, skip to the barcode scanner screen
    document.getElementById("setup-section").style.display = "none";
    document.getElementById("barcode-section").style.display = "block";
    if (barcodeInput) {
        barcodeInput.focus();
    } else {
        console.error("Barcode input field not found.");
    }
  } else {
    // If no products, show the file upload screen
    document.getElementById("setup-section").style.display = "block";
    document.getElementById("barcode-section").style.display = "none";
  }

  // Initialize auth code in localStorage if not set
  if (!localStorage.getItem("authCode")) {
    localStorage.setItem("authCode", DEFAULT_AUTH_CODE);
    console.log("Authorization code initialized to default.");
  }

  // Initialize fileUploaded flag in localStorage if not set
  if (!localStorage.getItem("fileUploaded")) {
    localStorage.setItem("fileUploaded", "false");
    console.log("fileUploaded flag initialized to false.");
  }

  // Check the fileUploaded flag and show the appropriate section
  if (localStorage.getItem("fileUploaded") === "true") {
    document.getElementById("setup-section").style.display = "none";
    document.getElementById("barcode-section").style.display = "block";
  } else {
    document.getElementById("setup-section").style.display = "block";
    document.getElementById("barcode-section").style.display = "none";
  }
  if (barcodeInput) {
    barcodeInput.focus(); // Ensure the focus is set as the app loads
    console.log("Barcode input field focused.");
  } else {
    console.error("Barcode input field not found.");
  } 
  // Attach event listener to closePopup button
  const closePopupButton = document.getElementById("closePopup");
  if (closePopupButton) {
    closePopupButton.addEventListener("click", () => {
      const popup = document.getElementById("popup");
      if (popup) {
        popup.style.display = "none"; // Close the popup
            if (barcodeInput) {
                barcodeInput.focus();
            } else {
                console.error("Barcode input field not found.");
            }
      } else {
        console.error("Popup element not found.");
      }
    });
  } else {
    console.error("closePopup button not found in the DOM.");
  }

  document.getElementById("changeAuthCancel").addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent the event from propagating to the document
    hideChangeAuthModal(); // Close the Change Code popup
  });

  document.getElementById("resetDefaultButton").addEventListener("click", () => {
    const confirmation = confirm("Are you sure you want to reset the authorization code to the default value?");
    if (confirmation) {
        localStorage.setItem("authCode", "12345"); // Reset the code to default
        alert("Authorization code has been reset to the default value");
        hideChangeAuthModal(); // Close the modal
    }
});

  document.getElementById("changeAuthSubmit").addEventListener("click", () => {
    const oldCode = document.getElementById("oldAuthCode").value.trim();
    const newCode = document.getElementById("newAuthCode").value.trim();
    const currentCode = localStorage.getItem("authCode") || DEFAULT_AUTH_CODE;
  
    if (oldCode !== currentCode) {
      hideChangeAuthModal(); // Hide the "Change Code" modal
      showPopup("error", "Current authorization code is incorrect."); // Display error popup
      return;
    }
  
    if (!newCode) {
      hideChangeAuthModal(); // Hide the "Change Code" modal
      showPopup("error", "New authorization code cannot be empty."); // Display error popup
      return;
    }
  
    localStorage.setItem("authCode", newCode); // Update the authorization code in localStorage
    hideChangeAuthModal(); // Hide the "Change Code" modal
    showPopup("success", "Authorization code updated successfully!"); // Display success popup
  });


// Event Listener: Keydown for manual input detection
barcodeInput.addEventListener("keydown", () => {
  isManualInput = true; // Mark as manual input
  console.log("Manual input detected (keydown event).");
});


  // Event Listener: Input for detecting scanned input
  barcodeInput.addEventListener("input", () => {
    const currentTime = Date.now();
    const timeDifference = currentTime - lastInputTime;

    // Check if input is from a scanner (rapid input)
    if (timeDifference < SCAN_THRESHOLD) {
      isScanning = true; // It's a scanned input
      isManualInput = false; // Override manual input flag
      console.log("Scanned input detected.");
    } else {
      isScanning = false; // Not a scanned input
    }

    // Clear timeout to debounce further input
    clearTimeout(barcodeInputTimeout);

    // Process the input after a delay (for scanned input completion)
    barcodeInputTimeout = setTimeout(() => {
      const barcode = barcodeInput.value.trim();

      if (isScanning && barcode) {
        console.log("Processing scanned input:", barcode);
        handleBarcodeInput(barcode); // Process scanned barcode
        barcodeInput.value = ""; // Clear input field for next scan
      }

      isScanning = false; // Reset scanning flag
    }, SCAN_THRESHOLD);

    lastInputTime = currentTime; // Update the last input time
  });

  // Event Listener: Check Price button for manual input
  document.getElementById("checkButton").addEventListener("click", () => {
    const barcode = barcodeInput.value.trim();
    if (barcode) {
      console.log("Manual check triggered for barcode:", barcode);
      handleBarcodeInput(barcode); // Process manual input
    } else {
      showPopup("error", "Please enter a valid barcode", null); // Show error for empty input
    }
    barcodeInput.value = ""; // Clear input field after checking
    isManualInput = false; // Reset manual input flag
  });

// Reset manual input flag on blur
barcodeInput.addEventListener("blur", () => {
  isManualInput = false; // Reset manual input flag
  console.log("Input field blurred. Resetting manual input flag.");
});

// Reset manual input flag on focus
barcodeInput.addEventListener("focus", () => {
  isManualInput = false; // Reset manual input flag
  console.log("Input field focused. Resetting manual input flag.");
});


  // File Upload Logic
  document.getElementById("uploadButton").addEventListener("click", () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
      showPopup("error","Please select a file to upload.");
      return;
    }

    const fileType = file.name.split(".").pop().toLowerCase();
    if (fileType === "csv") {
      processCSV(file);
    } else if (fileType === "xlsx") {
      processXLSX(file);
    } else {
      showPopup("error","Invalid file type. Please upload a CSV or XLSX file.");
    }
  });



  // Re-upload File Button Logic
  document.getElementById("reuploadButton").addEventListener("click", () => {
    showAuthModal();
  
    // Clear the file input field when opening the re-upload file section
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = ""; // Clear the file input field
    } else {
      console.error("File input field not found.");
    }
  });

  document.getElementById("changeAuthButton").addEventListener("click", () => {
    console.log("Change Code button clicked");
    showChangeAuthModal();
  });
  

  // Authorization Modal Logic for Re-upload
  document.getElementById("authSubmit").addEventListener("click", () => {
    const enteredCode = document.getElementById("authCodeInput").value.trim();
    const currentCode = localStorage.getItem("authCode") || DEFAULT_AUTH_CODE;

    if (enteredCode === currentCode) {
        // Check if a file was uploaded; skip clearing if no file is found
        if (localStorage.getItem("fileUploaded") === "true") {
            clearTable(); // Clear SQLite table only if a file was uploaded
        }

        localStorage.setItem("fileUploaded", "false"); // Reset fileUploaded flag
        hideAuthModal();

        document.getElementById("setup-section").style.display = "block";
        document.getElementById("barcode-section").style.display = "none";
    } else {
        showPopup("error","Invalid authorization code.");
    }
});


  document.getElementById("authCancel").addEventListener("click", () => {
    hideAuthModal();
  });

  // Menu Icon Toggle Logic
  const menuToggle = document.getElementById("menuToggle");
  const menuOptions = document.getElementById("menuOptions");


  if (menuToggle && menuOptions && barcodeInput) {
    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent click from propagating to the document
      const isMenuVisible = menuOptions.style.display === "block";

      // Toggle menu visibility
      menuOptions.style.display = isMenuVisible ? "none" : "block";
      // If the menu closes, shift focus back to the barcode input
    if (isMenuVisible) {
      console.log("Menu is closing. Shifting focus to barcode input.");
      barcodeInput.focus();
    }
    });


document.addEventListener("click", (event) => {
  const menuToggle = document.getElementById("menuToggle");
  const menuOptions = document.getElementById("menuOptions");
  const authModal = document.getElementById("authModal");
  const changeAuthModal = document.getElementById("changeAuthModal");

  // Check if click happened outside the menu
  if (!menuOptions.contains(event.target) && event.target !== menuToggle) {
    menuOptions.style.display = "none"; // Close the menu

    // Focus barcode input ONLY if no modals are open
    if (
      menuOptions.style.display === "none" &&
      (!authModal || authModal.style.display === "none") &&
      (!changeAuthModal || changeAuthModal.style.display === "none")
    ) {
      if (barcodeInput) {
        barcodeInput.focus();
      } else {
        console.error("Barcode input field not found.");
      }
    }
  }
});

  } else {
    console.error("Menu toggle, options, or barcode input field not found.");
  }

});
