let cardData = null;

fetch(
  "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448"
)
  .then((res) => res.json())
  .then((data) => {
    cardData = data;
    card();
  })
  .catch((error) => console.error(error));

function card() {
  if (!cardData) {
    console.error("there is no cardData");
  }
  const container = document.getElementById("container");
  //create a div for card
  const card = document.createElement("div");
  card.classList.add("card");
  const {
    images,
    options,
    price,
    compare_at_price,
    vendor,
    title,
    description,
  } = cardData.product;
  //extract colorData from api
  let colorsArray = options[0].values;
  //extract size data from api
  let sizeArray = options[1].values;
  //getting selectedColor Value
  let selectedColor;
  let selectedSize;
  let discount_percentage;
  let productQuantity = 1;

  //product counter function
  function updateProductCounter() {
    const decreaseButton = document.querySelector(".btn-decrease");
    const increaseButton = document.querySelector(".btn-increase");
    const quantityDisplay = document.getElementById("quantity-display");
    //decrease  value
    decreaseButton.addEventListener("click", () => {
      if (productQuantity > 1) {
        productQuantity--;
        quantityDisplay.textContent = productQuantity;
      }
    });
    //increase value
    increaseButton.addEventListener("click", () => {
      productQuantity++;
      quantityDisplay.textContent = productQuantity;
    });
  }

  //calculate percentage of discount
  function calculatePercentage(productCurrentPrice, compare_at_price) {
    const productPrice = parseFloat(productCurrentPrice.replace("$", ""));
    const compareAtPrice = parseFloat(compare_at_price.replace("$", ""));

    //calculate discount amount
    const discountAmount = compareAtPrice - productPrice;
    //calculate percentage
    const calculatePercentage = (discountAmount / compareAtPrice) * 100;
    return (discount_percentage = calculatePercentage.toFixed(0));
  }
  calculatePercentage(price, compare_at_price);

  //handle color value
  function handleColorBoxValue() {
    const colorBox = document.querySelectorAll(".color-box");
    colorBox.forEach((box) => {
      box.classList.remove("focus");
      box.addEventListener("click", () => {
        // Add 'focus' class to the clicked color box
        box.classList.add("focus");
        selectedColor = box.dataset.colorName;
      });
    });
  }
  //handle size values
  function handleSizeValue() {
    const sizeInputs = document.querySelectorAll(".size_input");
    sizeInputs.forEach((input) => {
      input.addEventListener("click", () => {
        // Reset style for all radio buttons
        sizeInputs.forEach((otherInput) => {
          otherInput.nextElementSibling.style.color = "";
          otherInput.checked = false;
        });
        // Update style for the clicked button
        input.nextElementSibling.style.color = "rgba(58, 73, 128, 1)";
        input.checked = true;
        // Get the value of the selected size
        selectedSize = input.value;
      });
    });
  }

  function cartMessage() {
    const addToCartBtn = document.querySelector(".cart_button");
    const cartMessage = document.querySelector(".cart_message");
    addToCartBtn.addEventListener("click", () => {
      let message = `${title} with `;
      if (selectedColor && selectedSize) {
        message += `${selectedColor} and size ${selectedSize} added to cart`;
      }
      cartMessage.style.display = "block";
      cartMessage.textContent = message;
    });
  }

  const cardHTML = `
  <div class="product_image_container">
    <img src="https://m.media-amazon.com/images/I/81lvHwohVgL._SY741_.jpg" alt="product_main_image" class="main_image"> 
    <div class="other_images_container">${images
      .map((image) => {
        return `<img src="https://m.media-amazon.com/images/I/81lvHwohVgL._SY741_.jpg" alt="product_image" class="other_images"/>`;
      })
      .join("")}</div>
  </div>
  <div class="product_details_container">
    <div class="product_name_container">
        <div class="vendor">${vendor}</div>
        <div class="title">${title}</div>
    </div>
    <div class="price_container">
        <div class="discounted_price_container">
            <span class="discounted_price">${compare_at_price}</span>
            <span class="main_price">${price}</span>
        </div>
        <div class="discount_percentage">${discount_percentage}%off</div>
    </div>
    <div class="colors_container">
      <div class="color_label">Choose a Color</div>
      <div class="colors_list">${colorsArray
        .map((color) => {
          const colorValue = Object.values(color).toString();
          const colorName = Object.keys(color).toString();
          return `<div class="color-box focus" style="background-color: ${colorValue};" data-color-name="${colorName}" ></div>`;
        })
        .join("")}</div>
    </div>
    <div class="size_container">
      <div class="color_label">Choose a Size</div>
      <div class="size_list">${sizeArray
        .map((size) => {
          return `
          <div class="size_button">
            <input type="radio" id=${size} name="size" value=${size} class="size_input"/>
            <label for=${size}>${size}</label>
         </div>
          
            `;
        })
        .join("")}</div>
    
    </div>
    <div class="product-counter">
        <div class="counter">
            <button class="btn-decrease border_none">-</button>
            <div id="quantity-display">${productQuantity}</div>
            <button class="btn-increase border_none">+</button>
        </div>
        <div class="cartContainer">
            <button class="cart_button">Add To Cart</button>
        </div>
    </div>
    <div class="cart_message"></div>
    <div class="product_description">${description}</div>
  </div>
  `;

  card.innerHTML = cardHTML;
  //append card to container
  container.appendChild(card);

  //call the handleBox value function update selectedColorValue
  if (colorsArray) {
    handleColorBoxValue();
  } else {
    throw new Error("No color options found.");
  }
  //call the handleSizeValue value function update selectedSizeValue
  if (sizeArray) {
    handleSizeValue();
  } else {
    throw new Error("no size options found.");
  }
  //update counter
  updateProductCounter();
  //update cart message
  cartMessage();
}

