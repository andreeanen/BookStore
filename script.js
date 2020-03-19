const baseUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?';
const queryString = 'requestKey';
const apiKey = 'apiKey';
const maxNumberRequests = 10;
let currentNumberRequests = 0;
let currentNumberAddRequests = 0;
let currentNumberApiRequests = 0;
let currentNumberDeleteRequests = 0;


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
                        keyStatus.innerHTML = '<br>The API key was successfully generated! After 1 try.';
                    }
                    else {
                        keyStatus.innerHTML = `<br>The API key was successfully generated! After ${currentNumberApiRequests} tries.`;
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
        keyStatus.innerHTML = 'You reached maximum number of API key requests.';
    }

};

function showAddBookForm() {
    document.getElementById('form-add-book').style.display = 'block';

}

function resetBookForm() {
    const form = document.getElementById('form-add-book');
    form.reset();
    form.style.display = 'none';
}

function submitBook() {
    const key = localStorage.getItem(apiKey);
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const addBookQueryString = `key=${key}&op=insert&title=${title}&author=${author}`;
    const addEndpoint = baseUrl + addBookQueryString;
    const showBooksStatus = document.getElementById('show-books-status');
    // const bookList = document.getElementById('book-list');
    if (currentNumberAddRequests < maxNumberRequests) {

        fetch(addEndpoint)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                currentNumberAddRequests++;

                if (data.status === 'success') {
                    if (currentNumberAddRequests === 1) {
                        showBooksStatus.innerHTML = '<br>The book was successfully added! After 1 try.';
                    }
                    else {
                        showBooksStatus.innerHTML = `<br>The book was successfully added! After ${currentNumberAddRequests} tries.`;
                    }

                    currentNumberAddRequests = 0;
                    showBooks();
                    resetBookForm();
                }
                else {
                    showBooksStatus.innerHTML = 'The book could not be added to the list.. Try again';
                    console.log(currentNumberAddRequests);
                    submitBook();
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    else {
        showBooksStatus.innerHTML = 'The book could not be added to the list.. Try again.';
        currentNumberAddRequests = 0;
    }

}

function removeKey() {
    localStorage.clear();
    initializePage();
    const keyStatus = document.getElementById('key-status');
    keyStatus.innerHTML = '<br>The API key was removed';
    currentNumberApiRequests = 0;
    currentNumberAddRequests = 0;
    currentNumberRequests = 0;
}

function initializePage() {
    const key = localStorage.getItem(apiKey);
    if (key) {
        document.getElementById('content').style.display = 'block';
        document.getElementById('add-book-button').style.display = 'block';
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

    if (currentNumberRequests < maxNumberRequests) {
        fetch(newEndpoint)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                currentNumberRequests++;

                if (data.status === 'success') {
                    if (data.data.length === 0) {
                        showBooksStatus.innerHTML = 'The list of books is empty.';
                    }
                    else if (data.data.length > 0) {
                        const bookListElement = document.getElementById('book-list');
                        bookListElement.innerHTML = "";
                        showBooksStatus.innerHTML = `<br>You have ${data.data.length} books in your bookstore!`;

                        for (let i = 0; i < data.data.length; i++) {
                            let item = document.createElement('li');
                            item.className = "list-items";
                            item.appendChild(document.createTextNode(`Title:  ${data.data[i].title}      Author:  ${data.data[i].author}`));
                            // const buttonDelete = document.createElement('button');
                            // buttonDelete.innerHTML = 'Delete';
                            // buttonDelete.addEventListener('click', function deleteBook() {
                            //     alert('delete book');
                            //     const deleteBookStatus = document.getElementById('delete-book-status');
                            //     const deleteBookQueryString = `key=${key}&op=delete&id=${data.data[i].id}`;
                            //     const deleteBookEndpoint = baseUrl + deleteBookQueryString;
                            //     if (currentNumberDeleteRequests < maxNumberRequests) {

                            //         fetch(deleteBookEndpoint)
                            //             .then(function (response) {
                            //                 return response.json();
                            //             })
                            //             .then(function (data) {
                            //                 currentNumberDeleteRequests++;
                            //                 console.log(data);

                            //                 if (data.status === 'success') {
                            //                     if (currentNumberDeleteRequests === 1) {
                            //                         showBooksStatus.innerHTML = '<br>The book was successfully deleted! After 1 try.';
                            //                     }
                            //                     else {
                            //                         showBooksStatus.innerHTML = `<br>The book was successfully deleted! After ${currentNumberDeleteRequests} tries.`;
                            //                     }

                            //                     currentNumberDeleteRequests = 0;
                            //                     showBooks();
                            //                 }
                            //                 else {
                            //                     //deleteBookStatus.innerHTML = 'The book could not be deleted from the list.';
                            //                     console.log(currentNumberDeleteRequests);
                            //                     deleteBook();
                            //                 }
                            //             })
                            //             .catch(function (error) {
                            //                 console.log(error);
                            //             })
                            //     }
                            //     else {
                            //         showBooksStatus.innerHTML = 'The book could not be deleted from the list.. Try again.';
                            //         currentNumberDeleteRequests = 0;
                            //     }


                            // });
                            // item.appendChild(buttonDelete);

                            bookListElement.appendChild(item);
                        }
                    }
                    currentNumberRequests = 0;
                }
                else {
                    showBooksStatus.innerHTML = 'There are no books to show.';
                    showBooks();
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    else {
        showBooksStatus.innerHTML = 'You reached the maximum number of tries to show the book';
        currentNumberRequests = 0;
    }

}


initializePage();

