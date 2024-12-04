// function showPopup(message) {
//     const popup = document.getElementById("popup");
//     const popupMessage = document.getElementById("popupMessage");
//     popupMessage.textContent = message;
//     popup.style.display = "flex";
//   }

function showPopup(productName, productPrice) {
    const popup = document.getElementById("popup");
    const productNameElement = document.getElementById("productName");
    const productPriceElement = document.getElementById("productPrice");
  
    if (popup && productNameElement && productPriceElement) {
      if (productName && productPrice) {
        // Case: Product found
        const formattedName = capitalize(productName); // Format product name
        productNameElement.textContent = `${formattedName}`;
        productPriceElement.textContent = `Price: $${productPrice}`;
        productPriceElement.style.color = "green"; // Optional: Set color to green for valid price
      } else {
        // Case: Product not found
        productNameElement.textContent = `Product not found`;
        productPriceElement.textContent = `Price: N/A`;
        productPriceElement.style.color = "red"; // Optional: Set color to red for "N/A"
      }
      popup.style.display = "flex"; // Show the popup
    } else {
      console.error("Popup or its child elements not found.");
    }
  }
  

  // Show Authorization Modal
  function showAuthModal() {
    const authModal = document.getElementById("authModal");
    if (authModal) {
      authModal.style.display = "flex";
    } else {
      console.error("Auth modal element not found.");
    }
  }


  // Hide Authorization Modal
  function hideAuthModal() {
    const authModal = document.getElementById("authModal");
    if (authModal) {
      authModal.style.display = "none";
      document.getElementById("authCodeInput").value = ""; // Clear input field
    } else {
      console.error("Auth modal element not found.");
    }
  }


  
  // Show Change Authorization Code Modal
  function showChangeAuthModal() {
    const changeAuthModal = document.getElementById("changeAuthModal");
    if (changeAuthModal) {
      console.log("Opening Change Auth Modal");
      changeAuthModal.style.display = "flex";
    } else {
      console.error("Change Auth Modal element not found.");
    }
  }

  function hideChangeAuthModal() {
    const changeAuthModal = document.getElementById("changeAuthModal");
    if (changeAuthModal) {
      changeAuthModal.style.display = "none"; // Hide the modal
      document.getElementById("oldAuthCode").value = ""; // Clear input fields
      document.getElementById("newAuthCode").value = "";
    } else {
      console.error("Change Auth Modal element not found.");
    }
  }