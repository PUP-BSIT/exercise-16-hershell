const movieTable = document.querySelector("#crud_form");
const endpoint = 'https://restapi.hershive.com/durante/durante_end_file.php';

document.querySelector("#crud_form")
.addEventListener("submit", function (event) {
  event.preventDefault();
  submitForm();
});

document.getElementById("update").addEventListener("click", function (event) {
  event.preventDefault();
  submitUpdate();
});

function getMovieDetails() {
  fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      const tableBody = document.getElementById("table_body");
      tableBody.innerHTML = ""; // Clear previous rows

      data.forEach((movie) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${movie.id}</td>
            <td>${movie.title}</td>
            <td>${movie.director}</td>
            <td>${movie.release_year}</td>
            <td>${movie.genre}</td>
            <td>${movie.rating}</td>`;

        const actionCell = document.createElement("td");

        const updateButton = document.createElement("button");
        updateButton.textContent = "Edit";
        updateButton.addEventListener("click", () => updateMovie(movie));
        actionCell.appendChild(updateButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteMovie(movie.id));
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);
        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function submitForm() {
  const movieTitle = document.querySelector("#movie_title").value;
  const directorName = document.querySelector("#director_name").value;
  const releaseYear = document.querySelector("#release_year").value;
  const genre = document.querySelector("#genre").value;
  const rating = document.querySelector("#rating").value;

  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: movieTitle,
      director: directorName,
      release_year: releaseYear,
      genre: genre,
      rating: rating,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      location.reload();
    })
    .catch((error) => {
      console.error("Error inserting movie:", error);
    });
}

function deleteMovie(id) {
  fetch(endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      location.reload();
    })
    .catch((error) => {
      console.error("Error deleting movie:", error);
    });
}

function updateMovie(movie) {
  const updateBtn = document.getElementById("update");
  const saveBtn = document.getElementById("save");

  updateBtn.style.display = "block";
  saveBtn.style.display = "none";

  document.getElementById("movie_id").value = movie.id;
  document.getElementById("movie_title").value = movie.title;
  document.getElementById("director_name").value = movie.director;
  document.getElementById("release_year").value = movie.release_year;
  document.getElementById("genre").value = movie.genre;
  document.getElementById("rating").value = movie.rating;
}

function submitUpdate() {
  const movieId = document.getElementById("movie_id").value;
  const movieTitle = document.querySelector("#movie_title").value;
  const directorName = document.querySelector("#director_name").value;
  const releaseYear = document.querySelector("#release_year").value;
  const genre = document.querySelector("#genre").value;
  const rating = document.querySelector("#rating").value;

  fetch(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: movieId,
      title: movieTitle,
      director: directorName,
      release_year: releaseYear,
      genre: genre,
      rating: rating,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      location.reload();
    })
    .catch((error) => {
      console.error("Error updating movie:", error);
    });
}

getMovieDetails();
