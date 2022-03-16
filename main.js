const books = [];
const RENDER_EVENT = "render-book";
const STORAGE_KEY = "BOOKSHELF_APPS";
 

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById("inputBook");

    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

function addBook(){
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const bookIsComplete = document.getElementById("inputBookIsComplete").checked;
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookIsComplete);
    books.push(bookObject);
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete){
    return {
        id,
        title, 
        author,
        year,
        isComplete
    }
}

document.addEventListener(RENDER_EVENT, function(){
    const incompletedBookshelfList = document.getElementById("incompleteBookshelfList");
    const completedBookshelfList = document.getElementById("completeBookshelfList");
    incompletedBookshelfList.innerHTML = "";
    completedBookshelfList.innerHTML = "";
    
    for (bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isComplete == false) {
            incompletedBookshelfList.append(bookElement);
        }else{
            completedBookshelfList.append(bookElement);
        }
    }
});

function makeBook(bookObject){
    const textTitle = document.createElement("h3");
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = `Penulis: ${bookObject.author}`;

    const textYear = document.createElement("p");
    textYear.innerText = `Tahun: ${bookObject.year}`;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");

    const completeButton = document.createElement("button");
    completeButton.classList.add("green");
    if (bookObject.isComplete){
        completeButton.innerText = "Belum selesai di Baca";
    }else{
        completeButton.innerText = "Selesai di Baca";
    }

    completeButton.addEventListener('click', function(){
        changeCompleteStatus(bookObject.id);
    })

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus";

    trashButton.addEventListener('click', function() {
        removeBook(bookObject.id);
    })

    buttonContainer.append(completeButton, trashButton);

    const container = document.createElement("article");
    container.classList.add("book_item");   
    container.setAttribute("id", `book-${bookObject.id}`);
    container.append(textTitle, textAuthor, textYear, buttonContainer);

    return container;
}

function changeCompleteStatus(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) true;
    if(bookTarget.isComplete == true){
        bookTarget.isComplete = false;
    }else if(bookTarget.isComplete == false){
        bookTarget.isComplete = true;
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId){
    for(bookItem of books){
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function removeBook(bookId){
    const bookTarget = findBookIndex(bookId);
    if(bookTarget === -1) return 0;
    books.splice(bookTarget, 1); 

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId){
    for (index in books){
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

function saveData() {
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}


function isStorageExist(){
  if(typeof(Storage) === undefined){
      alert("Sayang sekali, Browser tidak mendukung local storage :(");
      return false
  }
  return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
   
    let data = JSON.parse(serializedData);
   
    if(data !== null){
        for(book of data){
            books.push(book);
        }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
}