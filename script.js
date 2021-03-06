const baseUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?';
const queryString = 'requestKey';
const apiKey = 'apiKey';
const maxNumberRequests = 10;
let currentNumberRequests = 0;
let currentNumberAddRequests = 0;
let currentNumberApiRequests = 0;
let currentNumberDeleteRequests = 0;
let currentNumberEditRequests = 0;

function getApiKey() {
    const endpoint = baseUrl + queryString;
    const keyStatus = document.getElementById('key-status');

    if (currentNumberApiRequests < maxNumberRequests) {
        fetch(endpoint)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                currentNumberApiRequests++;

                if (data.status === 'success') {
                    console.log(data);
                    localStorage.setItem(apiKey, data.key);

                    if (currentNumberApiRequests === 1) {
                        keyStatus.innerHTML = 'The API key was successfully generated! After 1 try.';
                    }
                    else {
                        keyStatus.innerHTML = `The API key was successfully generated! After ${currentNumberApiRequests} tries.`;
                    }
                    currentNumberApiRequests = 0;
                    initializePage();
                }
                else {
                    keyStatus.innerHTML = 'The API key was not successfully generated.. Try again';
                    console.log(currentNumberApiRequests);
                    getApiKey();
                }
            })
            .catch(function (error) {
                keyStatus.innerHTML = 'Unexpected error! The API key was not successfully generated.. Try again';
            })

    }
    else {
        keyStatus.innerHTML = 'You reached maximum number of API key requests. Try again!';
    }

};

function showAddBookForm() {
    document.getElementById('form-add-book').style.display = 'block';
    document.getElementById('update-button').style.display = 'none';
    document.getElementById('submit-button').style.display = 'block';

}

function resetBookForm() {
    const form = document.getElementById('form-add-book');
    form.reset();
    form.style.display = 'none';
}

function submitBook() {
    const key = localStorage.getItem(apiKey);
    const title = document.getElementById('title');
    const author = document.getElementById('author');
    const addBookQueryString = `key=${key}&op=insert&title=${title.value}&author=${author.value}`;
    const addEndpoint = baseUrl + addBookQueryString;
    const addBookStatus = document.getElementById('add-book-status');

    const deleteBookStatus = document.getElementById('delete-book-status');
    deleteBookStatus.innerHTML = "";
    const modifyBookStatus = document.getElementById('modify-book-status');
    modifyBookStatus.innerHTML = "";

    if (!validateInput(title, author)) {
        return false;
    }

    if (currentNumberAddRequests < maxNumberRequests) {

        fetch(addEndpoint)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                currentNumberAddRequests++;

                if (data.status === 'success') {
                    if (currentNumberAddRequests === 1) {
                        addBookStatus.innerHTML = 'The book was successfully added to you list! After 1 try.';
                    }
                    else {
                        addBookStatus.innerHTML = `The book was successfully added to your list! After ${currentNumberAddRequests} tries.`;
                    }

                    currentNumberAddRequests = 0;
                    showBooks();
                    resetBookForm();
                }
                else {
                    addBookStatus.innerHTML = 'There was an error adding the book to the list.';
                    console.log(currentNumberAddRequests);
                    submitBook();
                }
            })
            .catch(function (error) {
                console.log(error);
                addBookStatus.innerHTML = 'An error was caught when trying to add the book.';
            })
    }
    else {
        addBookStatus.innerHTML = 'You reached the maximum number of requests to add the book to the list. Try again!';
        currentNumberAddRequests = 0;
    }

}

const validateInput = function (title, author) {
    if (title.value === "") {
        window.alert("Please enter the book title.");
        title.focus();
        return false;
    }
    if (author.value === "") {
        window.alert('Please enter the author of the book.');
        author.focus();
        return false;
    }
    return true;
}

function removeKey() {
    localStorage.clear();
    initializePage();
    const keyStatus = document.getElementById('key-status');
    keyStatus.innerHTML = 'The API key was removed';
    currentNumberApiRequests = 0;
    currentNumberAddRequests = 0;
    currentNumberRequests = 0;
    currentNumberDeleteRequests = 0;
    currentNumberEditRequests = 0;
    document.getElementById('content').style.display = 'none';
    document.getElementById('add-book-button').style.display = 'none';
    document.getElementById('get-books').style.display = 'none';
}

function initializePage() {
    const key = localStorage.getItem(apiKey);
    if (key) {
        document.getElementById('content').style.display = 'block';
        document.getElementById('add-book-button').style.display = 'inline-block';
        document.getElementById('get-books').style.display = 'inline-block';
        console.log('init');
        showBooks();
    }
    else {
        document.getElementById('content').style.display = 'none';
        console.log('show login');
    }
}

function showBooks() {
    const key = localStorage.getItem(apiKey);
    const getBooksQueryString = `key=${key}&op=select`;
    const newEndpoint = baseUrl + getBooksQueryString;
    const showBooksStatus = document.getElementById('show-books-status');
    const bookListElement = document.getElementById('book-list');
    bookListElement.innerHTML = "";

    if (currentNumberRequests < maxNumberRequests) {
        fetch(newEndpoint)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                currentNumberRequests++;

                if (data.status === 'success') {
                    if (data.data.length === 0) {
                        showBooksStatus.innerHTML = 'The booklist is empty.';
                    }
                    else if (data.data.length > 0) {
                        if (data.data.length === 1) {
                            showBooksStatus.innerHTML = `You have ${data.data.length} book in your booklist!`;
                        }
                        else {
                            showBooksStatus.innerHTML = `You have ${data.data.length} books in your booklist!`;
                        }


                        for (let i = 0; i < data.data.length; i++) {
                            const bookObject = data.data[i];
                            let item = document.createElement('li');

                            const buttonEdit = document.createElement('button');
                            buttonEdit.innerHTML = 'Edit';
                            buttonEdit.className = 'edit-button';
                            buttonEdit.addEventListener('click', function () { editForm(bookObject); });
                            item.appendChild(buttonEdit);

                            const buttonDelete = document.createElement('button');
                            buttonDelete.innerHTML = 'Delete';
                            buttonDelete.className = 'delete-button';
                            buttonDelete.addEventListener('click', function () { deleteBook(key, bookObject.id); });
                            item.appendChild(buttonDelete);

                            const buttonItem = document.createElement('button');
                            buttonItem.innerText = `${data.data[i].title} by ${data.data[i].author}`;
                            buttonItem.className = 'item-button';
                            item.appendChild(buttonItem);

                            item.className = "list-items";
                            bookListElement.appendChild(item);
                        }
                    }
                    currentNumberRequests = 0;
                    currentNumberDeleteRequests = 0;
                }
                else {
                    showBooksStatus.innerHTML = 'There was an error at showing books.';
                    showBooks();
                }
            })
            .catch(function (error) {
                console.log(error);
                showBooksStatus.innerHTML = 'An unexpected error was caught when trying to show the books.';
            })
    }
    else {
        showBooksStatus.innerHTML = 'You reached the maximum number of tries to show the books. Press "Get list of books" button!';
        currentNumberRequests = 0;
    }

}

const deleteBook = function (key, id) {
    const deleteBookStatus = document.getElementById('delete-book-status');
    const deleteBookQueryString = `key=${key}&op=delete&id=${id}`;
    const deleteBookEndpoint = baseUrl + deleteBookQueryString;
    const addBookStatus = document.getElementById('add-book-status');
    addBookStatus.innerHTML = "";
    const modifyBookStatus = document.getElementById('modify-book-status');
    modifyBookStatus.innerHTML = "";

    if (currentNumberDeleteRequests < maxNumberRequests) {

        fetch(deleteBookEndpoint)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                currentNumberDeleteRequests++;
                console.log(data);

                if (data.status === 'success') {
                    if (currentNumberDeleteRequests === 1) {
                        deleteBookStatus.innerHTML = 'The book you selected was successfully deleted! After 1 try.';
                    }
                    else {
                        deleteBookStatus.innerHTML = `The book you selected was successfully deleted! After ${currentNumberDeleteRequests} tries.`;
                    }

                    currentNumberDeleteRequests = 0;
                    showBooks();
                }
                else {
                    deleteBookStatus.innerHTML = 'There was an error deleting the book from the list.';
                    console.log(currentNumberDeleteRequests);
                    deleteBook(key, id);
                }
            })
            .catch(function (error) {
                console.log(error);
                deleteBookStatus.innerHTML = 'An unexpected error was caught when trying to delete the book.';
            })
    }
    else {
        deleteBookStatus.innerHTML = 'You reached the maximum number of requests to delete the book. Try again!';
        currentNumberDeleteRequests = 0;
    }
}

const editForm = function (bookToEdit) {
    const form = document.getElementById('form-add-book');
    form.style.display = 'block';
    document.getElementById('submit-button').style.display = 'none';
    document.getElementById('update-button').style.display = 'block';

    const oldTitle = document.getElementById('title');
    oldTitle.value = bookToEdit.title;

    const oldAuthor = document.getElementById('author');
    oldAuthor.value = bookToEdit.author;

    const bookToEditId = document.getElementById('book-edit-id');
    bookToEditId.value = bookToEdit.id;

}

const updateBook = function () {
    const key = localStorage.getItem(apiKey);
    const modifyBookStatus = document.getElementById('modify-book-status');
    const addBookStatus = document.getElementById('add-book-status');
    addBookStatus.innerHTML = "";
    const deleteBookStatus = document.getElementById('delete-book-status');
    deleteBookStatus.innerHTML = "";
    const newTitle = document.getElementById('title');
    const newTitleValue = newTitle.value;
    const newAuthor = document.getElementById('author');
    const newAuthorValue = newAuthor.value;
    const getBookToEditId = document.getElementById('book-edit-id').value;
    const updateBookQuery = `key=${key}&op=update&id=${getBookToEditId}&title=${newTitle.value}&author=${newAuthor.value}`;
    const editingEndpoint = baseUrl + updateBookQuery;

    if (!validateInput(newTitle, newAuthor)) {
        return false;
    }

    if (currentNumberEditRequests < maxNumberRequests) {
        fetch(editingEndpoint)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                currentNumberEditRequests++;

                if (data.status === 'success') {
                    console.log(data);

                    if (currentNumberEditRequests === 1) {
                        modifyBookStatus.innerHTML = 'The book you selected was successfully modified! After 1 try.';
                    }
                    else {
                        modifyBookStatus.innerHTML = `The book you selected was successfully modified! After ${currentNumberEditRequests} tries.`;
                    }
                    currentNumberEditRequests = 0;
                    showBooks();
                    resetBookForm();

                }
                else {
                    modifyBookStatus.innerHTML = 'There was an error trying to modify the book.';
                    console.log(currentNumberEditRequests);
                    updateBook();
                }
            })
            .catch(function (error) {
                modifyBookStatus.innerHTML = 'An unexpected error was caught when trying to modify the book.';
            })
    }
    else {
        modifyBookStatus.innerHTML = 'You reached maximum number of requests to modify the book. Try again!';
    }
}

initializePage();

