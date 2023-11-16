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

function showIsPremiumUser() {
  // Remove the "Buy Premium" button
  const buyPremiumButton = document.getElementById("razorpay");
  buyPremiumButton.remove();
  // Update the UI to show the premium user message
  document.getElementById("message").textContent = "You are a premium user";

  // Create and append the "Show Leaderboard" button
  const leaderboardButton = document.createElement("button");
  leaderboardButton.textContent = "Show Leaderboard";
  document.body.appendChild(leaderboardButton);

  leaderboardButton.addEventListener("click", async () => {
    // Handle the "Show Leaderboard" button click event

    const token = JSON.parse(localStorage.getItem("userDetails")).token;

    const getLeaderBoard = await axios.get(
      `http://localhost:8000/expense/showleaderboard`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(getLeaderBoard);
    const leaderboardElement = document.getElementById("leaderboard");
    leaderboardElement.innerHTML = "<h3>Leaderboard</h3>";
    getLeaderBoard.data.forEach((userDetails) => {
      leaderboardElement.innerHTML += `<div>id: ${userDetails.id} name: ${userDetails.name} total_cost: ${userDetails.total_cost}</div>`;
    });
    document.body.appendChild(leaderboardElement);
  });
}

const user = JSON.parse(localStorage.getItem("userDetails")).token;
const decodedUser = parseJwt(user);
const userDetails = decodedUser.id;
console.log(userDetails);

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

// Function to logout and redirect to the login page
function logout(e) {
  e.preventDefault();
  // // Clear the local storage
  // localStorage.clear();
  // // Redirect to the login page
  // window.location.href = "./Login.html";

  if (confirm("Are you sure you want to logout?")) {
    localStorage.clear();
    window.location.href = "./Login.html";
  }
}

// Add event listener to the logout button
document.getElementById("logout").addEventListener("click", logout);
