const API_KEY = "GOqdDw9gU6DRrDPUzdt0Dm0PZrM";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(
  document.getElementById("resultsModal")
);

document.getElementById("status").addEventListener("click", (e) => getStatus(e));

document.getElementById("submit").addEventListener("click", (e) => postForm(e));

const getStatus = async (e) => {
  const queryString = `${API_URL}?api_key=${API_KEY}`;
  const response = await fetch(queryString);
  const data = await response.json();
  if (response.ok) {
    displayStatus(data);
  } else {
    displayException(data);
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

const processOptions = (form) => {
  let optArray = [];
  for (let entry of form.entries()) {
    if (entry[0] === "options") {
      optArray.push(entry[1]);
    }
  }
  form.delete("options");
  form.append("options", optArray.join());
  return form;
};

const postForm = async (e) => {
  const form = processOptions(
    new FormData(document.getElementById("checksform"))
  );
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
    displayException(data);
    throw new Error(data.error);
  }
};

const displayErrors = (data) => {
  document.getElementById(
    "resultsModalTitle"
  ).innerText = `JSHint Results for ${data.file}`;
  let errors = "";
  data.error_list.forEach((error) => {
    errors += `<div>col: ${error.col} error: ${error.error}</div>`;
  });
  document.getElementById("results-content").innerHTML = errors;

  resultsModal.show();
};

const displayException = (exception) => {
  document.getElementById("resultsModalTitle").innerText =
    "An Exception Occurred";
  document.getElementById("results-content").innerHTML = `
    <div>The API returned status code ${exception.status_code}</div>
    <div>Error number: <span class="bold"> ${exception.error_no}</span></div>
    <div>Error text: <span class="bold"> ${exception.error}</span></div>
    `;
  resultsModal.show();
};
