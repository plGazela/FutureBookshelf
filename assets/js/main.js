import Bookshelf from "./modules/Bookshelf.js";
import Book from "./modules/Book.js";

const myBookshelf = new Bookshelf("bookshelf");

// Add book action
let avaliableBooks;
const searchResults = document.querySelector(`[data-name="dropdown"]`);
searchResults.addEventListener("click", (event) => {
    if(event.target.parentElement.getAttribute("data-action") === "add" || event.target.getAttribute("data-action") === "add") {
        const targetBook = event.target.closest('[data-name="dropdownBook"]');
        const targetBookID = targetBook.getAttribute("data-id");

        myBookshelf.addBook(targetBookID, avaliableBooks);
        event.target.parentElement.parentElement.parentElement.remove();

        let book = avaliableBooks.get(targetBookID);
        const id = book.id;
        const thumbnail = book.thumbnail;
        const title = book.title;
        const authors = book.authors;
        const description = book.description;

        // Add element to the list

        // Row
        const bookRow = document.createElement("div");
        bookRow.setAttribute("class", "px-1 py-3 row");
        bookRow.setAttribute("data-name", "book");
        bookRow.setAttribute("data-id", id);


        // Thumbnail column
        const bookThumbnailCol = document.createElement("div");
        bookThumbnailCol.setAttribute("class", "mb-3 mb-md-0 col-md-2");

        const bookThumbnail = document.createElement("img");
        bookThumbnail.setAttribute("class", "img-thumbnail mx-auto d-block");
        bookThumbnail.setAttribute("src", thumbnail);
        bookThumbnail.setAttribute("alt", title);

        bookThumbnailCol.appendChild(bookThumbnail);
        bookRow.appendChild(bookThumbnailCol);

        // Info column
        const bookInfoCol = document.createElement("div");
        bookInfoCol.setAttribute("class", "col-md-9");
        
        const bookTitle = document.createElement("h2");
        bookTitle.setAttribute("class", "h5");
        bookTitle.textContent = title;

        const bookAuthors = document.createElement("p");
        bookAuthors.setAttribute("class", "fst-italic");
        bookAuthors.textContent = authors;

        const bookDescription = document.createElement("p");
        bookDescription.setAttribute("class", "small");
        bookDescription.textContent = description;

        bookInfoCol.appendChild(bookTitle);
        bookInfoCol.appendChild(bookAuthors);
        bookInfoCol.appendChild(bookDescription);
        bookRow.appendChild(bookInfoCol);

        // Manage navigation
        const bookNavCol = document.createElement("nav");
        bookNavCol.setAttribute("class", "col-md-1 justify-content-md-center align-self-center d-grid d-md-flex");

        const bookRemove = document.createElement("button");
        bookRemove.setAttribute("class", "btn btn-danger");
        bookRemove.setAttribute("data-action", "remove");

        const bookRemoveIcon = document.createElement("i");
        bookRemoveIcon.setAttribute("class", "bi bi-trash3-fill");

        bookRemove.appendChild(bookRemoveIcon);
        bookNavCol.appendChild(bookRemove);
        bookRow.appendChild(bookNavCol);

        myBookshelf.bookshelf.appendChild(bookRow);

        saveBookshelf();
    }
});

// Remove book action
myBookshelf.bookshelf.addEventListener("click", (event) => {
    if(event.target.parentElement.getAttribute("data-action") === "remove" || event.target.getAttribute("data-action") === "remove") {
        const targetBook = event.target.closest('[data-name="book"]');
        const targetBookID = targetBook.getAttribute("data-id");

        targetBook.remove();
        myBookshelf.removeBook(targetBookID);

        saveBookshelf();
    }
});

// Search book action
const searchInput = document.querySelector(`[data-action="search"]`);

searchInput.addEventListener("input", () => {
    const searchInputValue = searchInput.value;

    if(searchInputValue !== "") {
        bookSearch(searchInputValue);
        searchResults.classList.remove("d-none");
    } else {
        searchResults.classList.add("d-none");
    }
})

async function bookSearch(input) {
    const response = await apiSearch(input);
    const data = await processData(response);
    avaliableBooks = data;
    await clearResults();
    await displayResults(data);
}

function clearResults() {
    const searchList = document.querySelector(`[data-name="dropdown"]`);

    searchList.innerHTML = "";
}

function apiSearch(keywords) {
    const booksData = fetch("https://www.googleapis.com/books/v1/volumes?q=" + keywords + "&maxResults=3")
        .then(response => response.json())
        .then(data => {
            return data;
        });

    return booksData;
}

function processData(data) {
    let avaliableBooks = new Map();

    const booksData = data.items;
    for (let book of booksData) {
        const id = book.id;
        const authors = book.volumeInfo.authors;
        const title = book.volumeInfo.title;

        let description = book.volumeInfo.description;
        typeof description === "undefined" ? description="" : description=description.substring(0, 300) + "[...]";

        let thumbnail;
        if((book.volumeInfo).hasOwnProperty("imageLinks")) {
            thumbnail = book.volumeInfo.imageLinks.thumbnail;
        } else {
            thumbnail = "";
        }

        const foundBook = new Book(id, title, authors, description, thumbnail);
        avaliableBooks.set(foundBook.id, foundBook);
    }

    return avaliableBooks;
}

function displayResults(booksList) {

    for (let book of booksList.values()) {
        const id = book.id;
        const thumbnail = book.thumbnail;
        const title = book.title;
        const authors = book.authors;
        const description = book.description;

        if (myBookshelf.books.has(id)) {
            continue;
        }

        // Add element to the list

        const searchList = document.querySelector(`[data-name="dropdown"]`);

        // Row
        const bookRow = document.createElement("div");
        bookRow.setAttribute("class", "px-1 py-3 row");
        bookRow.setAttribute("data-name", "dropdownBook");
        bookRow.setAttribute("data-id", id);


        // Thumbnail column
        const bookThumbnailCol = document.createElement("div");
        bookThumbnailCol.setAttribute("class", "mb-3 mb-md-0 col-md-2");

        const bookThumbnail = document.createElement("img");
        bookThumbnail.setAttribute("class", "img-thumbnail mx-auto d-block");
        bookThumbnail.setAttribute("src", thumbnail);
        bookThumbnail.setAttribute("alt", title);

        bookThumbnailCol.appendChild(bookThumbnail);
        bookRow.appendChild(bookThumbnailCol);

        // Info column
        const bookInfoCol = document.createElement("div");
        bookInfoCol.setAttribute("class", "col-md-9");
        
        const bookTitle = document.createElement("h2");
        bookTitle.setAttribute("class", "h5");
        bookTitle.textContent = title;

        const bookAuthors = document.createElement("p");
        bookAuthors.setAttribute("class", "fst-italic");
        bookAuthors.textContent = authors;

        const bookDescription = document.createElement("p");
        bookDescription.setAttribute("class", "small");
        bookDescription.textContent = description;

        bookInfoCol.appendChild(bookTitle);
        bookInfoCol.appendChild(bookAuthors);
        bookInfoCol.appendChild(bookDescription);
        bookRow.appendChild(bookInfoCol);

        // Manage navigation
        const bookNavCol = document.createElement("nav");
        bookNavCol.setAttribute("class", "col-md-1 justify-content-md-center align-self-center d-grid d-md-flex");

        const bookRemove = document.createElement("button");
        bookRemove.setAttribute("class", "btn btn-primary");
        bookRemove.setAttribute("data-action", "add");

        const bookRemoveIcon = document.createElement("i");
        bookRemoveIcon.setAttribute("class", "bi bi-plus");

        bookRemove.appendChild(bookRemoveIcon);
        bookNavCol.appendChild(bookRemove);
        bookRow.appendChild(bookNavCol);

        searchList.appendChild(bookRow);
    }
}


function saveBookshelf() {
    let stringifiedBookshelf = JSON.stringify(Array.from(myBookshelf.books.entries()));
    localStorage.setItem("myBookshelf", stringifiedBookshelf);
}

function loadBookshelf() {
    let parsedBookshelf = new Map(JSON.parse(localStorage.getItem("myBookshelf")));

    for(let book of parsedBookshelf.values()) {
        myBookshelf.books.set(book.id, book);

        const id = book.id;
        const thumbnail = book.thumbnail;
        const title = book.title;
        const authors = book.authors;
        const description = book.description;

        // Add element to the list

        // Row
        const bookRow = document.createElement("div");
        bookRow.setAttribute("class", "px-1 py-3 row");
        bookRow.setAttribute("data-name", "book");
        bookRow.setAttribute("data-id", id);


        // Thumbnail column
        const bookThumbnailCol = document.createElement("div");
        bookThumbnailCol.setAttribute("class", "mb-3 mb-md-0 col-md-2");

        const bookThumbnail = document.createElement("img");
        bookThumbnail.setAttribute("class", "img-thumbnail mx-auto d-block");
        bookThumbnail.setAttribute("src", thumbnail);
        bookThumbnail.setAttribute("alt", title);

        bookThumbnailCol.appendChild(bookThumbnail);
        bookRow.appendChild(bookThumbnailCol);

        // Info column
        const bookInfoCol = document.createElement("div");
        bookInfoCol.setAttribute("class", "col-md-9");
        
        const bookTitle = document.createElement("h2");
        bookTitle.setAttribute("class", "h5");
        bookTitle.textContent = title;

        const bookAuthors = document.createElement("p");
        bookAuthors.setAttribute("class", "fst-italic");
        bookAuthors.textContent = authors;

        const bookDescription = document.createElement("p");
        bookDescription.setAttribute("class", "small");
        bookDescription.textContent = description;

        bookInfoCol.appendChild(bookTitle);
        bookInfoCol.appendChild(bookAuthors);
        bookInfoCol.appendChild(bookDescription);
        bookRow.appendChild(bookInfoCol);

        // Manage navigation
        const bookNavCol = document.createElement("nav");
        bookNavCol.setAttribute("class", "col-md-1 justify-content-md-center align-self-center d-grid d-md-flex");

        const bookRemove = document.createElement("button");
        bookRemove.setAttribute("class", "btn btn-danger");
        bookRemove.setAttribute("data-action", "remove");

        const bookRemoveIcon = document.createElement("i");
        bookRemoveIcon.setAttribute("class", "bi bi-trash3-fill");

        bookRemove.appendChild(bookRemoveIcon);
        bookNavCol.appendChild(bookRemove);
        bookRow.appendChild(bookNavCol);

        myBookshelf.bookshelf.appendChild(bookRow);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadBookshelf();
})