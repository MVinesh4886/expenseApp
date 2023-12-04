async function loginUser(event) {
  event.preventDefault();
  const emailId = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await axios.post("http://localhost:8000/user/login", {
      emailId,
      password,
    });
    console.log(response.data);
    console.log(response.data.message);
    if (response.data.status === 401) {
      alert(response.data.message);
    } else {
      const userDetails = {
        emailId: response.data.emailId,
        password: response.data.password,
        userId: response.data.userId,
        token: response.data.token,
      };

      // Store user details in local storage
      localStorage.setItem("userDetails", JSON.stringify(userDetails));

      window.location.href = "./Expense.html";
      //   window.location.href = "http://localhost:8000/Expense.html";
    }
  } catch (error) {
    console.log(error);
    if (error.response.data) {
      alert(error.response.data.message);
    } else {
      alert("Invalid login Credentials");
    }
  }
}

document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form submission

    await loginUser(event); // Call the loginUser function
  });

const forgotPasswordButton = document.getElementById("forgotPassword");

forgotPasswordButton.addEventListener("click", async () => {
  const emailId = document.getElementById("email").value;

  // Check if the email field is empty
  if (emailId === "") {
    alert("Please enter your email first");
    return;
  }

  try {
    // Send a POST request to the backend to initiate the password reset process
    const response = await axios.post(
      "http://localhost:8000/user/forgotPassword",
      {
        emailId,
      }
    );

    console.log(response.data); // Email sent successfully
    alert("Check your email");
  } catch (error) {
    // Error message from the backend
    console.log(error);
  }
});
