const API_KEY = "GOqdDw9gU6DRrDPUzdt0Dm0PZrM";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(
  document.getElementById("resultsModal")
);

document
  .getElementById("status")
  .addEventListener("click", (e) => getStatus(e));

document.getElementById("submit").addEventListener("click", (e) => postForm(e));

const getStatus = async (e) => {
  const queryString = `${API_URL}?api_key=${API_KEY}`;
  const response = await fetch(queryString);
  const data = await response.json();
  if (response.ok) {
    displayStatus(data);
  } else {
    throw new Error(data.error);
  }
};

const displayStatus = (data) => {
  document.getElementById("resultsModalTitle").innerText = "API Key Status";
  document.getElementById("results-content").innerHTML = `
    <div>Your API key will expire on:</div>
    <div>${data.expiry}</div>
    `;
  resultsModal.show();
};

const postForm = async (e) => {
  const form = new FormData(document.getElementById("checksform"));

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: API_KEY,
    },
    body: form,
  });

  const data = await response.json();
  if (response.ok) {
    displayErrors(data);
  } else {
    throw new Error(data.error);
  }
};

const displayErrors = (data) => {
    document.getElementById("resultsModalTitle").innerText = `JSHint Results for ${data.file}`;
    let errors = ""
    data.error_list.forEach((error) => {
        errors += `<div>col: ${error.col} error: ${error.error}</div>`
    })
    document.getElementById("results-content").innerHTML = errors



    resultsModal.show();

}
