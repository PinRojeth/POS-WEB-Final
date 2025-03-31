let form = document.getElementById("productForm");
let productNameInput = document.getElementById("product-name");
let priceInput = document.getElementById("price");
let stockInput = document.getElementById("stock");
let categoryInput = document.getElementById("category");
let descriptionInput = document.getElementById("description");
let buttonSubmit = document.getElementById("btn-submit");
let productList = document.getElementById("product-list");
let editingIndex = null;

function getCookie(name) {
  let cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

function setCookie(name, value, expiredDay) {
  const date = new Date();
  date.setTime(date.getTime() + expiredDay * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/`;
}

function loadProduct() {
  let productCookie = getCookie("products");
  return productCookie ? JSON.parse(productCookie) : [];
}

let products = loadProduct();

function saveProduct() {
  setCookie("products", JSON.stringify(products));
  console.log(products);
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const productName = productNameInput.value.trim();
  const price = priceInput.value.trim();
  const stock = stockInput.value.trim();
  const category = categoryInput.value.trim();
  const description = descriptionInput.value.trim();
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

  // Ensure the values are not empty
  if (productName && price && stock) {
    const newProduct = {
      productName,
      formattedPrice,
      stock,
      category,
      description,
    };
    if (editingIndex === null) {
      // If not editing, add a new product
      products.push(newProduct);
    } else {
      // If editing, update the existing product
      products[editingIndex] = newProduct;
      editingIndex = null;
      buttonSubmit.textContent = "Add Product";
      form.reset();
    }
    saveProduct();
    renderProduct();
  }

  // Reset form fields
  productNameInput.value = "";
  priceInput.value = "";
  stockInput.value = "";
  categoryInput.value = "";
  descriptionInput.value = "";
});

function renderProduct() {
  if (productList) {
    productList.innerHTML = "";
    products?.forEach((product, index) => {
      productList.innerHTML += `<tr>
              <td>${(index + 1).toString().padStart(1, "0")}</td>
            <td>${product.productName}</td>
            <td>${product.formattedPrice}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
            <td>${product.description}</td>
            <td>
                <button class="btn btn-success btn-sm " onclick= "editProduct(${index})" >Edit</button>
                <button class="btn btn-danger btn-sm " onclick= "deleteProduct(${index})">Delete</button>
            </td>
        </tr>`;
    });
  }

  const productCountElement = document.getElementById("product-count");
  if (productCountElement) {
    const productCount = products?.length || 0;
    productCountElement.textContent = productCount;
  } else {
    console.error("Element with ID 'product-count' not found.");
  }
}

window.deleteProduct = (index) => {
  if (confirm("Are you sure you want to deleted this employee?")) {
    products.splice(index, 1);
    saveProduct();
    renderProduct();
  }
};

window.editProduct = (index) => {
  let product = products[index];
  buttonSubmit.textContent = "Update";
  productNameInput.value = product.productName;
  priceInput.value = product.formattedPrice.replace(/[^0-9.-]+/g, "");
  stockInput.value = product.stock;
  categoryInput.value = product.category;
  descriptionInput.value = product.description;
  editingIndex = index;
};

function loadCategories() {
  let categoriesCookie = getCookie("categories");
  return categoriesCookie ? JSON.parse(categoriesCookie) : [];
}
function populateCategoryDropdown() {
  const categoryInput = document.getElementById("category");
  const categories = loadCategories();

  if (categoryInput) {
    categoryInput.innerHTML = `<option value="">Select a category</option>`;

    const availableCategory = categories.filter(item => item.status === 1)
    // Loop through categories and add them as <option>
    availableCategory.forEach((category) => {
      categoryInput.innerHTML += `<option value="${category.categoryName}">${category.categoryName}</option>`;
    });
  }
}
populateCategoryDropdown();
renderProduct();
