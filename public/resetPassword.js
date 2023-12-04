const resetPasswordForm = document.getElementById("resetPasswordForm");

resetPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const emailId = document.getElementById("email").value;
  const password = document.getElementById("newPassword").value;

  try {
    const response = await axios.post(
      "http://localhost:8000/user/resetPassword",
      {
        emailId,
        password,
      }
    );

    console.log(response);
    alert("Password was reset successfully");
  } catch (error) {
    console.log("Error resetting password:", error);
  }
});
