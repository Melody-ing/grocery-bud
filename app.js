// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** EVENT LISTENERS **********
// submit form
form.addEventListener("submit", addItem);
// clear items
clearBtn.addEventListener("click", clearItems);

// display items onload
window.addEventListener("DOMContentLoaded", setupItems);

// ****** FUNCTIONS **********
function addItem(e) {
  e.preventDefault();
  const id = new Date().getTime().toString();
  const value = grocery.value;
  if (value.trim().length && !editFlag) {
    createListItem(id, value);
    // display alert
    displayAlert("item added to the list", "success");
    // show container
    container.classList.add("show-container");
    // add to local storage
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();
  } else if (value.trim().length && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("please enter value", "danger");
  }
}
// display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  // remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// clear items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");

  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

// delete button
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  console.log(element);

  list.removeChild(element);

  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");

  setBackToDefault();

  // remove from local storage
  removeFromLocalStorage(id);
}
// edit button
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  console.log(element);
  // set form value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "edit";
}

// set back to default
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
  // const grocery = { id: id, value: value }; 把它儲存為JSON格式，如果前後字串跟值是一樣的就可以簡寫為下面那樣
  const grocery = { id, value };
  let items = getLocalStorage();
  console.log(items);
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
    // 使用 filter() 方法將 items 陣列中符合條件的項目過濾出來。在這個情況下，你比較每個項目的 id 是否與傳入的 id 相符。如果 id 不相符，就保留該項目。
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
// localStorage API
// setItem
// getItem
// removeItem
// save as strings
// localStorage.setItem("orange", JSON.stringify(["item", "item2"]));
// const oranges = JSON.parse(localStorage.getItem("orange"));
// console.log(oranges);
// localStorage.removeItem("orange");
// console.log(localStorage);

// 如果不使用 JSON.stringify 和 JSON.parse 來進行轉換，而是直接將 JavaScript 物件存儲到 localStorage，或者從 localStorage 中取出，會有以下幾個問題：
// 1.資料格式不一致： localStorage 只能儲存字串型別的資料，如果直接將 JavaScript 物件存儲到 localStorage，它將以 [object Object] 或類似的字串形式顯示，而不是保留物件的結構和值。
// 2.無法正確讀取資料： 當你從 localStorage 中取出存儲的資料時，如果沒有進行適當的轉換，它將仍然是字串型別，你無法直接訪問其中的屬性或使用物件方法。
// 3.無法處理複雜的資料結構： JavaScript 物件可以包含嵌套的物件、陣列等複雜結構。如果直接將這樣的物件存儲到 localStorage 中，可能會導致資料的嵌套關係和結構遺失。
// 使用 JSON.stringify 和 JSON.parse 可以保證將 JavaScript 物件轉換為合法的 JSON 字串，並且可以在需要時將 JSON 字串轉換回正確的 JavaScript 物件，確保資料的完整性和一致性。這是一個適合儲存複雜資料結構並在不同環境中交換資料的常見做法。

// ****** SETUP ITEMS **********
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}
function createListItem(id, value) {
  const element = document.createElement("article");
  // add class
  element.classList.add("grocery-item");
  // add id
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>`;
  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);
  // append child
  list.appendChild(element);
}
