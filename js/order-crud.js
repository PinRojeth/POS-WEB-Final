let formOrder = document.getElementById("orderForm");
let orderIDInput = document.getElementById("order-id");
let statusOrderInput = document.getElementById("status");
let descriptionInputOrder = document.getElementById("description");
let btnSubmitOrder = document.getElementById("btn-submit");
let orderList = document.getElementById("order-list");
let editingIndexOrder = null;

// Load orders from cookies
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

function loadOrders() {
  let orderCookie = getCookie("orders");
  return orderCookie ? JSON.parse(orderCookie) : [];
}

let orders = loadOrders();

// Save orders to cookies
function saveOrders() {
  setCookie("orders", JSON.stringify(orders));
}

// Generate barcode for the canvas
function generateBarcode(orderID, canvasID) {
  JsBarcode(`#${canvasID}`, orderID, {
    format: "CODE128",
    lineColor: "#000000",
    width: 1.5,
    height: 16,
  });
}

// Handle form submission
formOrder?.addEventListener("submit", (e) => {
  e.preventDefault();
  const orderID = orderIDInput.value.trim();
  const status = Number(statusOrderInput.value);
  const description = descriptionInputOrder.value.trim();

  if (orderID) {
    const newOrder = { orderID, status, description };
    if (editingIndexOrder === null) {
      // Add a new order if we are not editing
      orders.push(newOrder);
    } else {
      // Update the existing order if we are editing
      orders[editingIndexOrder] = newOrder;
      editingIndexOrder = null;
      btnSubmitOrder.textContent = "Add Order";
    }
    saveOrders();
    renderOrders();
    formOrder.reset();
  }
});

// Render orders to the page
function renderOrders() {
  if (orderList) {
    orderList.innerHTML = "";
    orders.forEach((order, index) => {
      orderList.innerHTML += `<tr>
        <td>${(index + 1).toString().padStart(1, "0")}</td>
        <td>
          <svg id="barcode-${index}"></svg> <!-- Barcode will be displayed here -->
        </td>
        <td>${order.orderID}</td>
        <td><span class="badge ${
          order.status === 1
            ? "bg-success" 
            : order.status === 2
            ? "bg-warning" 
            : "bg-danger" 
        }">
            ${
              order.status === 1
                ? "Success"
                : order.status === 2
                ? "Pending"
                : "Fail"
            }
          </span></td>
        <td>${order.description}</td>
        <td>
          <button class="btn btn-success btn-sm" onclick="editOrder(${index})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteOrder(${index})">Delete</button>
        </td>
      </tr>`;

      // Generate barcode for each order inside the <svg> element
      JsBarcode(`#barcode-${index}`, order.orderID, {
        format: "CODE128", 
        lineColor: "#000000", 
        width: 1.5,
        height: 16, 
      });
    });
  }

  document.getElementById("order-count").textContent = orders?.length;
}

// Delete order
window.deleteOrder = (index) => {
  if (confirm("Are you sure you want to delete this order?")) {
    orders.splice(index, 1);
    saveOrders();
    renderOrders();
  }
};

// Edit order
window.editOrder = (index) => {
  let order = orders[index];
  btnSubmitOrder.textContent = "Update";
  orderIDInput.value = order.orderID;
  statusOrderInput.value = order.status;
  descriptionInputOrder.value = order.description;
  editingIndexOrder = index;
};

// Initial render of orders
renderOrders();

document.getElementById("order-id").addEventListener("input", function () {
  const orderId = document.getElementById("order-id").value.trim();

  if (orderId === "") {
    document.getElementById("barcode").innerHTML = ""; // Clear barcode when input is empty
  } else {
    JsBarcode("#barcode", orderId, {
      format: "CODE128", // Use the barcode format you prefer
      width: 2, // Width of bars
      height: 100, // Height of barcode
      displayValue: true, // Show the OrderID below the barcode
    });
  }
});

