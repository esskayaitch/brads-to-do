
// alert("I AM browser.js");

function itemTemplate(item) {

  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text">${item.text}</span>
            <div>
              <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
              <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
            </div>
          </li>`

}

// initial page load render
let ourHTML = items.map(function(item){
  return itemTemplate(item)
}).join('')
document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML)

// Create feature
let createField = document.getElementById("create-field")
// add onClick to the ADD NEW ITEM button
document.getElementById("create-form").addEventListener("submit", function (e) {
  e.preventDefault()

  axios.post('/create-item', { text: createField.value }).then(
    function (response) {
      // Update the text in the users browser (add the <li> item)
      document.getElementById("item-list").insertAdjacentHTML("beforeend", itemTemplate(response.data))
      createField.value = ""
      createField.focus()
    }
  ).catch(
    function () {
      console.log("HELP - an insert error occurred")
    }
  )

})

// add onClick to entire document 
document.addEventListener("click", function (e) {

  // See if the CLICK was on the DELETE button
  if (e.target.classList.contains("delete-me")) {
    if (confirm("Are you sure you want to delete this item permanently?")) {
      axios.post('/delete-item', { id: e.target.getAttribute("data-id") }).then(
        function () {
          // Update the text in the users browser
          e.target.parentElement.parentElement.remove()
        }
      ).catch(
        function () {
          console.log("HELP - a delete error occurred")
        }
      )
    }
  }

  // See if the CLICK was on the EDIT button
  if (e.target.classList.contains("edit-me")) {

    // prompt for new value whle displaying current
    let userInput = prompt("Enter new text", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
    // Use axios to send a request to the server to update the database, unless the user hit CANCEL buton on prompt
    if (userInput) {
      axios.post('/update-item', { text: userInput, id: e.target.getAttribute("data-id") }).then(
        function () {
          // Update the text in the users browser
          e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
        }
      ).catch(
        function () {
          console.log("HELP - a update error occurred")
        }
      )
    }
  }

  //
})
// end of file for browser.js