'use strict'

document.addEventListener("DOMContentLoaded", () => {
    // Get a list of item in inventory based on the classification_id
    let classificationList = document.querySelector('#classificationList')
    classificationList.addEventListener('change', function () {
        let classification_id = classificationList.value
        console.log(`classification_id is: ${classification_id}`)
        let classIdURL = '/inv/getInventory/'+ classification_id
        fetch(classIdURL)
        .then(function (response) {
            if (response.ok) {
                return response.json()
            }
            throw new Error("Network response was not OK");
            
        })
        .then(function (data) {
            console.log(data)
            buildInventoryList(data)
        })
        .catch(function (error) {
            console.log('There was a problem: ', error.message)
        })
    })
})

// Build inventory items into HTML table components and inject into DOM 
function buildInventoryList(data) { 
  let inventoryDisplay = document.getElementById("inventoryDisplay"); 
  
  // Set up the table with classes for styling
  let dataTable = `
    <thead>
      <tr>
        <th style="text-align:left; padding: 8px; background:#f4f4f4;">Vehicle Name</th>
        <th style="padding: 8px; background:#f4f4f4;">Modify</th>
        <th style="padding: 8px; background:#f4f4f4;">Delete</th>
      </tr>
    </thead>
    <tbody>
  `; 

  // Iterate over all vehicles in the array and put each in a row 
  data.forEach(function (element) { 
    console.log(element.inv_id + ", " + element.inv_model); 
    dataTable += `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 8px;">${element.inv_make} ${element.inv_model}</td>
        <td style="padding: 8px;">
          <a href='/inv/edit/${element.inv_id}' 
             style="color: #007bff; text-decoration:none;" 
             title='Click to update'>Modify</a>
        </td>
        <td style="padding: 8px;">
          <a href='/inv/delete/${element.inv_id}' 
             style="color: #dc3545; text-decoration:none;" 
             title='Click to delete'>Delete</a>
        </td>
      </tr>
    `; 
  }) 

  dataTable += '</tbody>'; 
  
  // Display the contents in the Inventory Management view 
  inventoryDisplay.innerHTML = `
    <table style="width:100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px;">
      ${dataTable}
    </table>
  `;
}