'use strict'


document.addEventListener('DOMContentLoaded', function() {

    const bookContainer = document.querySelector('#book-container')
    const bookURL = `http://localhost:3000/books`
    const bookForm = document.querySelector('#book-form')
    let allBooks = []

    //MUESTRA LOS LIBROS
    fetch(`${bookURL}`)
        .then(response => response.json())
        .then(bookData => bookData.forEach(function(book) {
            allBooks = bookData
            bookContainer.innerHTML += `
        <div id=book-${book.id}>
          <h2>${book.title}</h2>
          <h4>Author: ${book.author}</h4>
          <img src="${book.coverImage}" width="333" height="300">
          <p>${book.description}</p>
          <button data-id=${book.id} id="edit-${book.id}" data-action="edit">Edit</button>
          <button data-id=${book.id} id="delete-${book.id}" data-action="delete">Delete</button>
        </div>
        <div id=edit-book-${book.id}>
        </div>
        <hr>`


        }))

    //CREATE
    bookForm.addEventListener('submit', (e) => {
            event.preventDefault();

            const titleInput = bookForm.querySelector('#title').value
            const authorInput = bookForm.querySelector('#author').value
            const coverImageInput = bookForm.querySelector('#coverImage').value
            const descInput = bookForm.querySelector('#description').value

            fetch(`${bookURL}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        title: titleInput,
                        author: authorInput,
                        coverImage: coverImageInput,
                        description: descInput
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.json())
                .then(book => {
                    allBooks.push(book)
                    bookContainer.innerHTML += `
          <div id=book-${book.id}>
            <h2>${book.title}</h2>
            <h4>Author: ${book.author}</h4>
            <img src="${book.coverImage}" width="333" height="500">
            <p>${book.description}</p>
            <button data-id=${book.id} id="edit-${book.id}" data-action="edit">Edit</button>
            <button data-id=${book.id} id="delete-${book.id}" data-action="delete">Delete</button>
          </div>
          <div id=edit-book-${book.id}>
          </div>`
                })

        }) //TERMINA INICIO 



    //INICIO EDIT
    bookContainer.addEventListener('click', (e) => {
            if (e.target.dataset.action === 'edit') {

                const editButton = document.querySelector(`#edit-${e.target.dataset.id}`)
                editButton.disabled = true

                const bookData = allBooks.find((book) => {
                    return book.id == e.target.dataset.id

                })
                console.log(bookData)

                const editForm = bookContainer.querySelector(`#edit-book-${e.target.dataset.id}`)
                editForm.innerHTML = `
          <form class='form' id='edit-book' action='index.html' method='post'>
            <form id="book-form">
              <input required id="edit-title" placeholder="${bookData.title}">
              <input required id="edit-author" placeholder="${bookData.author}">
              <input required id="edit-coverImage" placeholder="${bookData.coverImage}">
              <input required id="edit-description" placeholder="${bookData.description}">
              <input type="submit" value="Edit Book">
          </form>`

                editForm.addEventListener("submit", (e) => {
                        event.preventDefault()

                        const titleInput = document.querySelector("#edit-title").value
                        const authorInput = document.querySelector("#edit-author").value
                        const coverImageInput = document.querySelector("#edit-coverImage").value
                        const descInput = document.querySelector("#edit-description").value
                        const editedBook = document.querySelector(`#book-${bookData.id}`)

                        fetch(`${bookURL}/${bookData.id}`, {
                                method: 'PATCH',
                                body: JSON.stringify({
                                    title: titleInput,
                                    author: authorInput,
                                    coverImage: coverImageInput,
                                    description: descInput
                                }),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).then(response => response.json())
                            .then(book => {
                                editedBook.innerHTML = `
              <div id=book-${book.id}>
                <h2>${book.title}</h2>
                <h4>Author: ${book.author}</h4>
                <img src="${book.coverImage}" width="333" height="300">
                <p>${book.description}</p>
                <button data-id=${book.id} id="edit-${book.id}" data-action="edit">Edit</button>
                <button data-id=${book.id} id="delete-${book.id}" data-action="delete">Delete</button>
              </div>
              <div id=edit-book-${book.id}>
              </div>`
                                editForm.innerHTML = ""
                            })
                    })
                    //TERMINA EDIT


                //INICIA DELETE
            } else if (e.target.dataset.action === 'delete') {
                document.querySelector(`#book-${e.target.dataset.id}`).remove()
                fetch(`${bookURL}/${e.target.dataset.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.json())
            }

        })
        //TERMINA DELETE

})