document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("productForm");
  
  // Add a listener for the reset event to prevent validation
  form.addEventListener("reset", function () {
    form.classList.remove("was-validated", "is-valid");
  });

  form.addEventListener("submit", function (event) {
    // Only validate if the form is not being reset
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add("was-validated");
    } else {
      form.classList.remove("was-validated");
    }
  }, false);
});
