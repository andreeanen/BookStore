const baseUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?';
const queryString = 'requestKey';
const apiKey = 'apiKey';
const maxNumberRequests = 10;
let currentNumberRequests = 0;
let currentNumberAddRequests = 0;
let currentNumberApiRequests = 0;
//const keyStatus = document.getElementById('key-status');
function loadDocument() {
    const getBooksButton = document.getElementById('get-books-button');
    const bookList = document.getElementById('book-list');
    getBooksButton.addEventListener('click', getApiKey);
}
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
    //const addBookButton = document.getElementById('add-book-button');
    document.getElementById('form-add-book').style.display = 'block';
    // alert('You pressed a button');

}

function submitBook() {
    const key = localStorage.getItem(apiKey);
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;

    const addBookQueryString = `key=${key}&op=insert&title=${title}&author=${author}`;
    const addEndpoint = baseUrl + addBookQueryString;
    const showBooksStatus = document.getElementById('show-books-status');
    if (currentNumberAddRequests < maxNumberRequests) {

        fetch(addEndpoint)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                currentNumberAddRequests++;
                if (data.status === 'success') {
                    console.log(data.id);
                    if (currentNumberAddRequests === 1) {
                        showBooksStatus.innerHTML = '<br>The API key was successfully generated! After 1 try.';
                    }
                    else {
                        showBooksStatus.innerHTML = `<br>The API key was successfully generated! After ${currentNumberAddRequests} tries.`;
                    }

                    currentNumberAddRequests = 0;
                    showBooks();
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
        showBooksStatus.innerHTML = 'You reached maximum number of requests to show the books list.';
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
    showBooksStatus.innerHTML = "";

}



function initializePage() {
    const key = localStorage.getItem(apiKey);
    if (key) {
        document.getElementById('content').style.display = 'block';
        document.getElementById('add-book-button').style.display = 'block';
        console.log('init');
        showBooks();
        // submitBook(key);


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
    const showBooksList = document.getElementById('book-list');
    const showBooksStatus = document.getElementById('show-books-status');
    if (currentNumberRequests < maxNumberRequests) {

        fetch(newEndpoint)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                currentNumberRequests++;
                console.log(data);
                // if (data.data.length === 0 && data.status === 'success') {
                //     showBooksStatus.innerHTML = 'The list of books is empty.';
                // }
                // else if (data.data.length > 0 && data.status === 'success') {
                //     showBooksList.innerHTML = 'My list with a lot of books';
                //     currentNumberRequests = 0;
                // }
                // else {
                //     showBooksStatus.innerHTML += 'The book could not be added to the list.. Try again';
                //     console.log(currentNumberRequests);
                //     showBooks();
                // }


                if (data.status === 'success') {
                    console.log(data);
                    if (data.data.length === 0) {

                        showBooksStatus.innerHTML = 'The list of books is empty.';
                    }
                    else if (data.data.length > 0) {
                        showBooksStatus.innerHTML += `<br>You have ${data.data.length} books in your bookstore!`;
                        //showBooksList.innerHTML = 'My list with a lot of books';
                        let bookList = document.createElement('ul');
                        for (let i = 0; i < data.data.length; i++) {
                            let item = document.createElement('li');
                            item.appendChild(document.createTextNode(`Title:  ${data.data[i].title}      Author:  ${data.data[i].author}`));
                            bookList.appendChild(item);
                            document.getElementById('book-list').appendChild(bookList);

                        }
                        //document.getElementById('book-list').appendChild(bookList);


                    }
                    currentNumberRequests = 0;
                }
                else {
                    //showBooksStatus.innerHTML = 'The book was not added.';
                    console.log(currentNumberRequests);
                    showBooks();
                }


            })
            .catch(function (error) {
                console.log(error);
            })
    }

}


initializePage();

