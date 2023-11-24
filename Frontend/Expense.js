let expenseInput = document.getElementById("expenseAmount");
let descriptionInput = document.getElementById("description");
let categoryInput = document.getElementById("category");

let addExpenseButton = document.getElementById("addExpense");

let expenseList = document.getElementById("expenseList");

let expenses = [];

let userId = ""; // Declare a variable to store the userId
let isPremiumUser = false; // Declare a variable to store the premium user status

// Retrieve the userId and premium user status from local storage
if (localStorage.userDetails) {
  const userDetails = JSON.parse(localStorage.userDetails);
  userId = userDetails.userId;
  isPremiumUser = userDetails.isPremiumUser || false;
}

if (localStorage.expenses) {
  expenses = JSON.parse(localStorage.expenses);
}

addExpenseButton.addEventListener("click", async function () {
  let expenseAmount = expenseInput.value;
  let description = descriptionInput.value;
  let category = categoryInput.value;

  let expense = {
    amount: expenseAmount,
    description,
    category,
    userId,
  };

  try {
    const token = JSON.parse(localStorage.getItem("userDetails")).token;

    const response = await axios.post(
      "http://localhost:8000/expense/create",
      expense,
      {
        headers: {
          Authorization: `Bearer ${token} `,
        },
      }
    );

    expense.id = response.data.data.id;
    alert("Added expenses successfully to the database");
  } catch (error) {
    console.log(error);
    alert("Request failed with status code 400");
  }

  expenses.push(expense);
  localStorage.expenses = JSON.stringify(expenses);

  expenseInput.value = "";
  descriptionInput.value = "";
  displayExpenses();
});

function displayExpenses() {
  expenseList.innerHTML = "";

  for (let i = 0; i < expenses.length; i++) {
    let expense = expenses[i];
    let listItem = document.createElement("li");
    listItem.innerHTML = `Expense Amount: ${expense.amount}, Description: ${expense.description}, Category: ${expense.category}`;

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = " Delete";
    deleteButton.addEventListener("click", async function () {
      try {
        const token = JSON.parse(localStorage.getItem("userDetails")).token;
        const deleteResponse = await axios.delete(
          `http://localhost:8000/expense/delete/${expense.id}`,
          {
            headers: {
              Authorization: `Bearer ${token} `,
            },
          }
        );

        console.log(deleteResponse);
        alert("Delete response from the database successfully");

        // Remove the expense from the expenses array
        expenses.splice(i, 1);

        localStorage.removeItem("expenses");
        // Update the local storage
        localStorage.setItem("expenses", JSON.stringify(expenses));

        // Update the displayed expenses
        displayExpenses();
      } catch (error) {
        console.log(error);
      }
    });

    let editButton = document.createElement("button");
    editButton.textContent = " Edit";
    editButton.addEventListener("click", function () {
      // Set the expense details as the current values of the input fields
      expenseInput.value = expense.amount;
      descriptionInput.value = expense.description;
      categoryInput.value = expense.category;

      // Create a save button
      const saveButton = document.createElement("button");
      saveButton.textContent = "Save";

      // Add an event listener to the save button
      saveButton.addEventListener("click", async function () {
        // Get the updated expense details from the input fields
        const updatedAmount = expenseInput.value;
        const updatedDescription = descriptionInput.value;
        const updatedCategory = categoryInput.value;

        // Update the expense object with the updated details
        expense.amount = updatedAmount;
        expense.description = updatedDescription;
        expense.category = updatedCategory;

        try {
          const token = JSON.parse(localStorage.getItem("userDetails")).token;

          const response = await axios.put(
            `http://localhost:8000/expense/put/${expense.id}`,
            expense,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response);
          alert("Expense updated successfully in the database");
        } catch (error) {
          console.log(error);
          alert("Request failed with status code 400");
        }

        // Update the local storage
        localStorage.setItem("expenses", JSON.stringify(expenses));

        // Update the displayed expenses
        displayExpenses();

        // Remove the save button and restore the delete and edit buttons
        listItem.removeChild(saveButton);
        listItem.appendChild(deleteButton);
        listItem.appendChild(editButton);
      });

      // Replace the edit button with the save button
      listItem.replaceChild(saveButton, editButton);
    });

    listItem.appendChild(deleteButton);
    listItem.appendChild(editButton);
    expenseList.appendChild(listItem);
  }
}
displayExpenses();

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

// document.getElementById("download").addEventListener("click", download);

async function download() {
  try {
    const token = JSON.parse(localStorage.getItem("userDetails")).token;

    const response = await axios.get(`http://localhost:8000/expense/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      // The backend is essentially sending a download link
      // which if we open in browser, the file would download
      var a = document.createElement("a");
      a.href = response.data.fileUrl;
      a.download = "myexpense.csv";
      a.click();
    }
  } catch (error) {
    console.log(error);
  }
}

//if the user is premium then we remove the buyPremium button and show that he is a premium user.
function showIsPremiumUser() {
  // Remove the "Buy Premium" button
  const buyPremiumButton = document.getElementById("razorpay");
  buyPremiumButton.remove();
  // Update the UI to show the premium user message
  document.getElementById("message").textContent = "YOU ARE A PREMIUM USER NOW";
  const leaderboardButton = document.createElement("button");
  leaderboardButton.textContent = "Show Leaderboard";
  leaderboardButton.className = "leaderboard";
  document.body.appendChild(leaderboardButton);

  leaderboardButton.addEventListener("click", () => {
    const screenWidth = window.innerWidth;
    let page, size;

    if (screenWidth >= 1024) {
      // For big screens, restrict to certain pages
      page = 0; // Change this to the desired page number
      size = 10; // Change this to the desired number of expenses per page
    } else {
      // For small screens, restrict to certain page
      page = 0;
      size = 5;
    }

    userLeaderboard(page, size);
    leaderboardButton.remove();
  });

  const userLeaderboard = async (page, size) => {
    try {
      const token = JSON.parse(localStorage.getItem("userDetails")).token;

      const getLeaderBoard = await axios.get(
        `http://localhost:8000/expense/showleaderboard?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const leaderboardElement = document.getElementById("leaderboard");
      leaderboardElement.innerHTML = "<h3>Leaderboard</h3>";
      leaderboardElement.className = "header";

      getLeaderBoard.data.leaderboard.forEach((userDetails) => {
        const userElement = document.createElement("div");
        userElement.textContent = `id: ${userDetails.id} name: ${userDetails.name} total_cost: ${userDetails.total_cost}`;
        leaderboardElement.appendChild(userElement);
        userElement.className = "text";
      });

      // Add pagination buttons
      const paginationContainer = document.getElementById("page");
      paginationContainer.innerHTML = "";

      // Previous button
      if (page > 0) {
        const previousButton = document.createElement("button");
        previousButton.textContent = "Previous";
        previousButton.className = "button";
        previousButton.addEventListener("click", () => {
          userLeaderboard(page - 1, size);
        });
        paginationContainer.appendChild(previousButton);
      }

      // Next button
      const nextButton = document.createElement("button");
      nextButton.textContent = "Next";
      nextButton.className = "button";
      nextButton.addEventListener("click", () => {
        userLeaderboard(page + 1, size);
      });
      paginationContainer.appendChild(nextButton);
    } catch (error) {
      console.log(error);
      // Handle the error or display a user-friendly error message
    }
  };
}

const user = JSON.parse(localStorage.getItem("userDetails")).token;
const decodedUser = parseJwt(user);
const userDetails = decodedUser.id;
console.log(userDetails);

//To check if the user is premium user or not.
function checkIsPremimumUser() {
  const orderToken = JSON.parse(localStorage.getItem("Token"));
  if (orderToken) {
    const decodedToken = parseJwt(orderToken);
    console.log(decodedToken);
    console.log(decodedToken.id.isPremiumUser);
    console.log(decodedToken.id.id);
    if (
      decodedToken.id.isPremiumUser === true &&
      userDetails === decodedToken.id.id
    ) {
      showIsPremiumUser();
    }
  }
}

// for razor pay,
document
  .getElementById("razorpay")
  .addEventListener("click", async function (e) {
    e.preventDefault();

    try {
      const token = JSON.parse(localStorage.getItem("userDetails")).token;

      const response = await axios.get(
        `http://localhost:8000/purchasePremium`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

      const options = {
        key: response.data.key_id,
        orderId: response.data.orderId,
        handler: async function () {
          const res = await axios.post(
            "http://localhost:8000/updateTransactionStatus",
            {
              orderId: options.orderId,
              paymentId: response.razorpay_paymentId,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(res.data.token);

          alert("You are a Premium user now");

          localStorage.removeItem("Token");
          localStorage.setItem("Token", JSON.stringify(res.data.token));

          checkIsPremimumUser();
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
    }
  });

checkIsPremimumUser();

// Add event listener to the logout button
document.getElementById("logout").addEventListener("click", logout);
// Function to logout and redirect to the login page
function logout(e) {
  e.preventDefault();

  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("expenses");

    window.location.href = "./Login.html";
  }
}

// // Function to load expenses
// const loadExpenses = async (page, size) => {
//   try {
//     const response = await axios.get(
//       `http://localhost:8000/expense/?page=${page}&size=${size}`
//     );
//     const { success, pagination } = response.data;

//     if (success) {
//       // Clear previous expenses
//       document.getElementById("expensesContainer").innerHTML = "";

//       // Display expenses
//       pagination.forEach((expense) => {
//         const expenseElement = document.createElement("div");
//         expenseElement.innerHTML = `
//           Amount: ${expense.amount}
//         Description: ${expense.description}
//           Category: ${expense.category}
//         `;
//         document
//           .getElementById("expensesContainer")
//           .appendChild(expenseElement);
//       });

//       // Add pagination buttons
//       const paginationContainer = document.getElementById("pagination");
//       paginationContainer.innerHTML = "";

//       // Previous button
//       if (page > 0) {
//         const previousButton = document.createElement("button");
//         previousButton.innerText = "Previous";
//         previousButton.addEventListener("click", () => {
//           loadExpenses(page - 1, size);
//         });
//         paginationContainer.appendChild(previousButton);
//       }

//       // Next button
//       const nextButton = document.createElement("button");
//       nextButton.innerText = "Next";
//       nextButton.addEventListener("click", () => {
//         loadExpenses(page + 1, size);
//       });
//       paginationContainer.appendChild(nextButton);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// // Function to load expenses with pagination
// const loadExpenses = async (page, size, id) => {
//   try {
//     const response = await axios.get(
//       `http://localhost:8000/expense/${id}?page=${page}&size=${size}`
//     );
//     const { success, pagination } = response.data;

//     if (success) {
//       // Clear previous expenses
//       document.getElementById("expensesContainer").innerHTML = "";

//       // Display expenses
//       pagination.rows.forEach((expense) => {
//         const expenseElement = document.createElement("div");
//         expenseElement.innerHTML = `
//           Amount: ${expense.amount}
//           Description: ${expense.description}
//           Category: ${expense.category}
//         `;
//         document
//           .getElementById("expensesContainer")
//           .appendChild(expenseElement);
//       });

//       // Add pagination buttons
//       const paginationContainer = document.getElementById("pagination");
//       paginationContainer.innerHTML = "";

//       // Previous button
//       if (page > 0) {
//         const previousButton = document.createElement("button");
//         previousButton.innerText = "Previous";
//         previousButton.addEventListener("click", () => {
//           loadExpenses(page - 1, size, id);
//         });
//         paginationContainer.appendChild(previousButton);
//       }

//       // Next button
//       const nextButton = document.createElement("button");
//       nextButton.innerText = "Next";
//       nextButton.addEventListener("click", () => {
//         loadExpenses(page + 1, size, id);
//       });
//       paginationContainer.appendChild(nextButton);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// // Event listener for the button click
// document
//   .getElementById("loadExpensesButton")
//   .addEventListener("click", async () => {
//     const screenWidth = window.innerWidth;
//     let page, size;

//     if (screenWidth >= 1024) {
//       // For big screens, restrict to certain pages
//       page = 0; // Change this to the desired page number
//       size = 10; // Change this to the desired number of expenses per page
//     } else {
//       // For small screens, restrict to certain page
//       page = 0;
//       size = 5;
//     }
//     try {
//       // Make an API call to retrieve the user ID after login
//       const response = await axios.get("http://localhost:8000/user"); // Replace with the appropriate API endpoint
//       const { id } = response.data;

//       loadExpenses(page, size, id);
//     } catch (error) {
//       console.log(error);
//     }
//   });
