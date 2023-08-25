class Bookshelf {
    constructor(bookshelfName) {
        this.bookshelf = document.querySelector(`[data-name="${bookshelfName}"]`);
        this.books = new Map();
    }
    addBook(bookID, searchResults) {
        const book = searchResults.get(bookID);
        this.books.set(book.id, book);
    }
    removeBook(bookID) {
        this.books.delete(bookID);
    }
}

export default Bookshelf;