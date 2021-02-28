//represents a book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//handles UI tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();
        books.forEach((book) => UI.addBooksToList(book));
    }
    static addBooksToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class = "btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const conatainer = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        conatainer.insertBefore(div, form);
        //vanish in 3s
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
    static clearField() {
        document.querySelector('#book-name').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }
}

//Store class handles storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('Books') === null) {
            books = [];
        } else {
            books = JSON.parent(localStorage.getItem('Books'));
        }
        return books;
    }
    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }

        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

//event:display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);
//add a book

const bookInput = document.querySelector('#book-form');
bookInput.addEventListener('submit', (e) => {
    //prevent default submit
    e.preventDefault();
    //take input values
    const bookTitle = document.querySelector('#book-name').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    //validate
    if (bookTitle === '' || author === '' || isbn === '') {
        UI.showAlert("Please fill in all fields", 'danger');
    } else {
        //Instantiate book
        const book = new Book(bookTitle, author, isbn);
        //add book to UI
        UI.addBooksToList(book);
        //add book to store
        Store.addBook(book);
        //show 
        UI.showAlert("Book successfully added", 'success');
        //clear fields
        UI.clearField();
    }

});

//delete book
const bookList = document.querySelector('#book-list');
bookList.addEventListener('click', (e) => {
    //remove book from ui
    UI.deleteBook(e.target);
    //remove from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    //show book removed
    UI.showAlert("Book removed", 'success');
});