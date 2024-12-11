// Function to handle barcode input
// function handleBarcodeInput(barcode) {
//   console.log("Looking up barcode:", barcode);
//   // const product = getProductByBarcode(barcode); // Replace with your DB logic
//   // if (product) {
//   //   showPopup("productInfo", product.name, product.price);
//   // } else {
//   //   showPopup("productInfo", null, null); // Show "Product not found"
//   // }
//   const inputBarcode = barcode ? barcode.value.trim() : "";
//   getProductByBarcode(inputBarcode).then((product) => {
//     if (product) {
//         console.log("Product found and returned:", product);
//         // Update your UI or logic here with the found product
//         showProductPopup(product.name, product.price); // Hypothetical function
//     } else {
//         console.warn("Product not found.");
//         showProductPopup("Product not found", "N/A");
//     }
// }).catch((error) => {
//     console.error("Error while fetching product:", error);
//     showProductPopup("Error", "N/A");
// });
// }

function handleBarcodeInput(barcode) {
  if (!barcode) {
      console.warn("No barcode input provided.");
      showProductPopup("Product not found", "N/A"); // Display a message for missing input
      return;
  }

  const inputBarcode = typeof barcode === "string" ? barcode.trim() : barcode.value?.trim();
  if (!inputBarcode) {
      console.warn("Empty or invalid barcode.");
      showPopup("Product not found", "N/A"); // Display a message for empty input
      return;
  }

  console.log("Looking up barcode:", inputBarcode);

  getProductByBarcode(inputBarcode)
      .then((product) => {
          if (product) {
              console.log("Product found and returned:", product);
              showPopup("productInfo",product.name, product.price); // Display product details
          } else {
              console.warn("Product not found.");
              showPopup("productInfo", null, null);
          }
      })
      .catch((error) => {
          console.error("Error while fetching product:", error);
          showPopup("Error", "N/A");
      });
}

function showPopup(type, productName = null, productPrice = null) {
    const popup = document.getElementById("popup");
    const productNameElement = document.getElementById("productName");
    const productPriceElement = document.getElementById("productPrice");
  
    if (popup && productNameElement && productPriceElement) {
      switch (type) {
        case "productInfo":
          if (productName && productPrice) {
            // Case: Product found
            const formattedName = capitalize(productName); // Format product name
            productNameElement.textContent = `Product: ${formattedName}`;
            productPriceElement.textContent = `Price: $${productPrice}`;
            productPriceElement.style.color = "green"; // Set color to green for valid price
          } else {
            // Case: Product not found
            productNameElement.textContent = `Product not found`;
            productPriceElement.textContent = `Price: N/A`;
            productPriceElement.style.color = "red"; // Set color to red for "N/A"
          }
          break;
  
        case "success":
          productNameElement.textContent = productName; // Display success message
          productPriceElement.textContent = ""; // Clear price element
          break;
  
        case "error":
          productNameElement.textContent = productName; // Display error message
          productPriceElement.textContent = ""; // Clear price element
          break;
  
        default:
          console.error("Unknown popup type:", type);
          return; // Exit function for unknown types
      }
  
      popup.style.display = "flex"; // Show the popup
    } else {
      console.error("Popup or its child elements not found.");
    }
  }
  
  


  


  
  
  

  // Show Authorization Modal
//   function showAuthModal() {
//     const authModal = document.getElementById("authModal");
//     if (authModal) {
//       authModal.style.display = "flex";
//     } else {
//       console.error("Auth modal element not found.");
//     }
//   }
// function showAuthModal() {
//     const authModal = document.getElementById("authModal");
//     if (authModal) {
//       authModal.style.display = "flex";
  
//       // Focus the input field inside the modal
//       const authCodeInput = document.getElementById("authCodeInput");
//       if (authCodeInput) {
//         authCodeInput.focus();
//       } else {
//         console.error("Auth code input field not found.");
//       }
//     }
//   }
function showAuthModal() {
    const authModal = document.getElementById("authModal");
    const authCodeInput = document.getElementById("authCodeInput");

    if (authModal) {
        authModal.style.display = "flex";

        // Clear the auth code input field without disturbing focus
        if (authCodeInput) {
            authCodeInput.value = ""; // Clear the input field
            setTimeout(() => {
                authCodeInput.focus(); // Restore focus after clearing the field
            }, 0); // Slight delay to ensure smooth behavior
        } else {
            console.error("Auth code input field not found.");
        }
    } else {
        console.error("Auth modal element not found.");
    }
}



  // Hide Authorization Modal
//   function hideAuthModal() {
//     const authModal = document.getElementById("authModal");
//     if (authModal) {
//       authModal.style.display = "none";
//       document.getElementById("authCodeInput").value = ""; // Clear input field
//     } else {
//       console.error("Auth modal element not found.");
//     }
//   }
// function hideAuthModal() {
//     const authModal = document.getElementById("authModal");
//     if (authModal) {
//       authModal.style.display = "none";
  
//       // Focus barcode input after closing the modal
//       const barcodeInput = document.getElementById("barcodeInput");
//       if (barcodeInput) {
//         barcodeInput.focus();
//       }
//     }
//   }
  function hideAuthModal() {
    const authModal = document.getElementById("authModal");
    const changeAuthModal = document.getElementById("changeAuthModal");
    const barcodeInput = document.getElementById("barcodeInput");

    if (authModal) {
        authModal.style.display = "none";
    }

    // Focus barcode input only if the Change Auth Modal is not visible
    if (changeAuthModal && changeAuthModal.style.display !== "block") {
        if (barcodeInput) {
            barcodeInput.focus();
        } else {
            console.error("Barcode input field not found.");
        }
    }
}



  
  // Show Change Authorization Code Modal
//   function showChangeAuthModal() {
//     const changeAuthModal = document.getElementById("changeAuthModal");
//     if (changeAuthModal) {
//       console.log("Opening Change Auth Modal");
//       changeAuthModal.style.display = "flex";
//     } else {
//       console.error("Change Auth Modal element not found.");
//     }
//   }
function showChangeAuthModal() {
    const changeAuthModal = document.getElementById("changeAuthModal");
    if (changeAuthModal) {
      changeAuthModal.style.display = "flex";
  
      // Focus the old code input field inside the modal
      const oldAuthCodeInput = document.getElementById("oldAuthCode");
      if (oldAuthCodeInput) {
        oldAuthCodeInput.focus();
      } else {
        console.error("Old auth code input field not found.");
      }
    }
  }

//   function hideChangeAuthModal() {
//     const changeAuthModal = document.getElementById("changeAuthModal");
//     if (changeAuthModal) {
//       changeAuthModal.style.display = "none"; // Hide the modal
//       document.getElementById("oldAuthCode").value = ""; // Clear input fields
//       document.getElementById("newAuthCode").value = "";
//     } else {
//       console.error("Change Auth Modal element not found.");
//     }
//   }
// Hide change authorization modal
function hideChangeAuthModal() {
    const changeAuthModal = document.getElementById("changeAuthModal");
    if (changeAuthModal) {
        changeAuthModal.style.display = "none";
        document.getElementById("oldAuthCode").value = ""; // Clear input fields
        document.getElementById("newAuthCode").value = ""; 
    }

    // Focus on the barcode input if no other modals are open
    const authModal = document.getElementById("authModal");
    const barcodeInput = document.getElementById("barcodeInput");
    if (!authModal || authModal.style.display === "none") {
        if (barcodeInput) {
            barcodeInput.focus();
        } else {
            console.error("Barcode input field not found.");
        }
    }
}
