let formCategory = document.getElementById("categoryForm");
let categoryNameInput = document.getElementById("category-name");
let statusInput = document.getElementById("status");
let descriptionInputCategory = document.getElementById("description");
let btnSubmit = document.getElementById("btn-submit");
let categoryList = document.getElementById("category-list");
let editingIndexCategory = null;

function getCookie(name) {
  let cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName.trim() === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

function setCookie(name, value, expiredDays = 30) {
  const date = new Date();
  date.setTime(date.getTime() + expiredDays * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${date.toUTCString()}; path=/`;
}

function loadCategories() {
  let categoryCookie = getCookie("categories");
  return categoryCookie ? JSON.parse(categoryCookie) : [];
}

let categories = loadCategories();

function saveCategories() {
  setCookie("categories", JSON.stringify(categories));
}

formCategory?.addEventListener("submit", (e) => {
  e.preventDefault();
  const categoryName = categoryNameInput.value.trim();
  const status = Number(statusInput.value); 
  const description = descriptionInputCategory.value.trim();

  if (categoryName) {
    const newCategory = { categoryName, status, description };
    if (editingIndexCategory === null) {
      // Add a new category if we are not editing
      categories.push(newCategory);
    } else {
      // Update the existing category if we are editing
      categories[editingIndexCategory] = newCategory;
      editingIndexCategory = null;
      btnSubmit.textContent = "Add Category";
    }
    saveCategories();
    renderCategories();
    formCategory.reset();
  }
});

function renderCategories() {
  if (categoryList) {
    categoryList.innerHTML = "";
    categories.forEach((category, index) => {
      categoryList.innerHTML += `<tr>
      <td>${(index + 1).toString().padStart(1, "0")}</td>
      <td>${category.categoryName}</td>
      <td>${category.status === 1 ? "Available" : "Unavailable"}</td>
      <td>${category.description}</td>
      <td>
        <button class="btn btn-success btn-sm" onclick="editCategory(${index})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteCategory(${index})">Delete</button>
      </td>
    </tr>`;
    });
  }

  let test = (document.getElementById("category-count").textContent =
    categories?.length);
  console.log(test);
}

window.deleteCategory = (index) => {
  if (confirm("Are you sure you want to delete this category?")) {
    categories.splice(index, 1);
    saveCategories();
    renderCategories();
  }
};

window.editCategory = (index) => {
  let category = categories[index];
  btnSubmit.textContent = "Update";
  categoryNameInput.value = category.categoryName;
  statusInput.value = category.status;
  descriptionInputCategory.value = category.description;
  editingIndexCategory = index;
};

renderCategories();
