document.addEventListener("DOMContentLoaded", function () {
  loadMusic();

  document
    .getElementById("add_music")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const title = document.getElementById("title").value;
      const artist = document.getElementById("artist").value;
      const album = document.getElementById("album").value;
      const releaseYear = document.getElementById("release_year").value;
      const genre = document.getElementById("genre").value;

      fetch("https://restapi.hershive.com/siervo/siervo_end_file.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          artist,
          album,
          release_year: releaseYear,
          genre,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          loadMusic();
          clearForm();
        });
    });
});

function loadMusic() {
  fetch("https://restapi.hershive.com/siervo/siervo_end_file.php")
    .then((response) => response.json())
    .then((data) => {
      const tbody = document
        .getElementById("music_table")
        .querySelector("tbody");
      tbody.innerHTML = "";

      data.forEach((song, index) => {
        const row = document.createElement("tr");
        row.id = `row_${song.id}`;
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${song.title}</td>
          <td>${song.artist}</td>
          <td>${song.album}</td>
          <td>${song.release_year}</td>
          <td>${song.genre}</td>
          <td>
            <button onclick="editMusic(${song.id})">Edit</button>
            <button onclick="deleteMusic(${song.id})">Delete</button>
          </td>`;
        tbody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error loading songs:", error);
    });
}

function editMusic(id) {
  const row = document.querySelector(`#row_${id}`);
  const cells = row.querySelectorAll("td");

  const title = cells[1].innerText;
  const artist = cells[2].innerText;
  const album = cells[3].innerText;
  const releaseYear = cells[4].innerText;
  const genre = cells[5].innerText;

  row.innerHTML = `
    <td>${cells[0].innerText}</td>
    <td><input type="text" value="${title}" id="edit_title_${id}"/></td>
    <td><input type="text" value="${artist}" id="edit_artist_${id}"/></td>
    <td><input type="text" value="${album}" id="edit_album_${id}"/></td>
    <td><input type="number" value="${releaseYear}" id="edit_release_${id}"/></td>
    <td><input type="text" value="${genre}" id="edit_genre_${id}"/></td>
    <td>
      <button onclick="saveEdit(${id})">Save</button>
      <button onclick="loadMusic()">Cancel</button>
    </td>`;
}

function saveEdit(id) {
  const updatedMusic = {
    id: id,
    title: document.getElementById(`edit_title_${id}`).value,
    artist: document.getElementById(`edit_artist_${id}`).value,
    album: document.getElementById(`edit_album_${id}`).value,
    release_year: document.getElementById(`edit_release_${id}`).value,
    genre: document.getElementById(`edit_genre_${id}`).value,
  };

  fetch("https://restapi.hershive.com/siervo/siervo_end_file.php", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedMusic),
  })
    .then((response) => response.json())
    .then(() => {
      loadMusic();
    })
    .catch((error) => {
      console.error("Error updating song:", error);
    });
}

function deleteMusic(id) {
  if (!confirm("Are you sure you want to delete this song?")) return;

  fetch("https://restapi.hershive.com/siervo/siervo_end_file.php", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  })
    .then((response) => response.json())
    .then(() => {
      loadMusic();
    })
    .catch((error) => {
      console.error("Error deleting song:", error);
    });
}

function clearForm() {
  document.getElementById("add_music").reset();
}