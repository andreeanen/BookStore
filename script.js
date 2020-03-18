const baseUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?';
const queryString = 'requestKey';
const apiKey = 'apiKey';
const maxNumberRequests = 10;
let currentNumberRequests = 0;
//const keyStatus = document.getElementById('key-status');
function loadDocument() {
    const getBooksButton = document.getElementById('get-books-button');
    const bookList = document.getElementById('book-list');
    getBooksButton.addEventListener('click', getApiKey);
}
function getApiKey() {
    const endpoint = baseUrl + queryString;
    const keyStatus = document.getElementById('key-status');

    if (currentNumberRequests < maxNumberRequests) {
        fetch(endpoint)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                currentNumberRequests++;

                if (data.status === 'success') {
                    console.log(data);
                    localStorage.setItem(apiKey, data.key);

                    //const numberOfTries = 10 - maxNumberRequests;
                    if (currentNumberRequests === 1) {
                        keyStatus.innerHTML = '<br>The API key was successfully generated! After 1 try.';
                    }
                    else {
                        keyStatus.innerHTML = `<br>The API key was successfully generated! After ${currentNumberRequests} tries.`;
                    }
                    currentNumberRequests = 0;
                    //keyStatus.innerHTML = '<br>The API key was successfully generated! After  .';
                    initializePage();
                }
                else {
                    keyStatus.innerHTML = 'The API key was not successfully generated.. Try again';
                    console.log(currentNumberRequests);
                    getApiKey();

                }
            })
            .catch(function (error) {
                //return console.log(error)
                keyStatus.innerHTML = 'Unexpected error! The API key was not successfully generated.. Try again';
            })

    }
    else {
        keyStatus.innerHTML = 'You reached maximum number of API key requests.';
    }

};

function removeKey() {
    localStorage.clear();
    initializePage();
    const keyStatus = document.getElementById('key-status');
    keyStatus.innerHTML = '<br>The API key was removed';

}



function initializePage() {
    const key = localStorage.getItem(apiKey);
    if (key) {
        document.getElementById('content').style.display = 'block';
        document.getElementById('add-book-button').style.display = 'block';
        console.log('init');
        showBooks(key);


    }
    else {
        document.getElementById('content').style.display = 'none';
        console.log('show login');
    }
}
function showBooks(key) {
    const getBooksQueryString = `key=${key}&op=select`;
    const newEndpoint = baseUrl + getBooksQueryString;
    const showBooksList = document.getElementById('show-books');

    fetch(newEndpoint)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.status === 'success') {
                console.log(data);

                showBooksList.innerHTML = 'My list with a lot of books';
            }


        })
        .catch(function (error) {
            console.log(error);
        })

}

function addBook() {
    const addBookButton = document.getElementById('add-book-button');
    document.getElementById('form-add-book').style.display = 'block';



}

initializePage();
