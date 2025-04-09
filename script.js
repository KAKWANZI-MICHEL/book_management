// Get DOM elements
const bookList = document.getElementById("bookList");
const searchInput = document.getElementById("searchInput");
const addBookForm = document.getElementById("addBookForm");
const addBookModal = new bootstrap.Modal(document.getElementById("addBookModal"));
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const genreInput = document.getElementById("genre");
const statusInput = document.getElementById("status");
const fileInput = document.getElementById("image"); // Renaming it to 'file' for general use

let books = JSON.parse(localStorage.getItem("books")) || [];

// Save books to localStorage
function saveBooks() {
  localStorage.setItem("books", JSON.stringify(books));
  displayBooks();
}

// Display books
function displayBooks() {
  const tab = document.querySelector('.nav-link.active').getAttribute('data-tab');
  let filteredBooks = books;

  // Filter books based on the selected tab
  if (tab === 'favorites') {
    filteredBooks = books.filter(book => book.favorite);
  } else if (tab === 'read') {
    filteredBooks = books.filter(book => book.status === 'Read');
  } else if (tab === 'unread') {
    filteredBooks = books.filter(book => book.status === 'Unread');
  }

  // Filter by search query
  const query = searchInput.value.toLowerCase();
  filteredBooks = filteredBooks.filter(book => {
    return book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query);
  });

  bookList.innerHTML = filteredBooks.map(book => `
    <div class="col">
      <div class="card">
        <img src="${book.image}" class="card-img-top" alt="Book Cover">
        <div class="card-body">
          <h5 class="card-title">${book.title}</h5>
          <p class="card-text">${book.author} - ${book.genre}</p>
          <p class="card-text"><strong>Status:</strong> ${book.status}</p>
          <p><strong>File:</strong> <a href="${book.file}" target="_blank">${book.file}</a></p>
          <button class="btn btn-warning" onclick="editBook('${book.id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteBook('${book.id}')">Delete</button>
          <button class="btn btn-info" onclick="toggleFavorite('${book.id}')">${book.favorite ? 'Unfavorite' : 'Favorite'}</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Add book
function addBook(event) {
  event.preventDefault();

  const book = {
    id: Date.now().toString(),
    title: titleInput.value,
    author: authorInput.value,
    genre: genreInput.value,
    status: statusInput.value,
    favorite: false,
    image: fileInput.files[0] ? URL.createObjectURL(fileInput.files[0]) : "", // Display file as URL
    file: fileInput.files[0] ? fileInput.files[0].name : "", // Store file name/path
  };

  books.push(book);
  saveBooks();
  addBookModal.hide();
  addBookForm.reset();
}

// Edit book
function editBook(bookId) {
  const book = books.find(book => book.id === bookId);
  titleInput.value = book.title;
  authorInput.value = book.author;
  genreInput.value = book.genre;
  statusInput.value = book.status;
  fileInput.value = ""; // Allow uploading a new file

  // Change form submit action to update
  addBookForm.onsubmit = function (event) {
    event.preventDefault();

    book.title = titleInput.value;
    book.author = authorInput.value;
    book.genre = genreInput.value;
    book.status = statusInput.value;
    book.image = fileInput.files[0] ? URL.createObjectURL(fileInput.files[0]) : book.image; // Only update image if new one is selected
    book.file = fileInput.files[0] ? fileInput.files[0].name : book.file; // Only update file name if new one is selected

    saveBooks();
    addBookModal.hide();
    addBookForm.reset();
  };

  addBookModal.show();
}

// Delete book
function deleteBook(bookId) {
  const bookIndex = books.findIndex(book => book.id === bookId);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    saveBooks();
  }
}

// Toggle favorite status
function toggleFavorite(bookId) {
  const book = books.find(book => book.id === bookId);
  if (book) {
    book.favorite = !book.favorite;
    saveBooks();
  }
}

// Search books
searchInput.addEventListener("input", displayBooks);

// Listen for form submission to add book
addBookForm.addEventListener("submit", addBook);

// Initialize by displaying books
displayBooks();
