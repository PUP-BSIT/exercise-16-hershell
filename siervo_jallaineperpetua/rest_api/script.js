document
  .getElementById("add_music")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const artist = document.getElementById("artist").value;
    const album = document.getElementById("album").value;
    const releaseYear = document.getElementById("release_year").value;
    const genre = document.getElementById("genre").value;

    if (
      !document.getElementById("update_button").classList.contains("hidden")
    ) {
      const id = document.getElementById("add_music").dataset.id;
      const updatedMusic = { id, title, artist, album, releaseYear, genre };

      fetch('https://restapi.hershive.com/siervo/siervo_end_file.php', {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMusic),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          loadMusic();
          clearForm();
        });
    } else {
      fetch('https://restapi.hershive.com/siervo/siervo_end_file.php', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          artist,
          album,
          release_year: releaseYear,
          genre,
        })
      })
        .then((response) => response.json())
        .then(() => {
          loadMusic();
          clearForm();
      });
      }
  });
          

function loadMusic() {
  fetch('https://restapi.hershive.com/siervo/siervo_end_file.php')
    .then((response) => response.json())
    .then((data) => {
      const tbody = document
        .getElementById("music_table")
        .querySelector("tbody");
      tbody.innerHTML = "";
      data.forEach((songs, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${
                  index + 1
                }</td> <!-- Display the index + 1 for numbering -->
                <td>${songs.title}</td>
                <td>${songs.artist}</td>
                <td>${songs.album}</td>
                <td>${songs.release_year}</td>
                <td>${songs.genre}</td>
                <td>
                    <button onclick="editMusic(${songs.id})">Edit</button>
                    <button onclick="deleteMusic(${songs.id})">Delete</button>
                </td>`;
        tbody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error loading songs:", error);
    });
}

function editMusic(id) {
  fetch(`https://restapi.hershive.com/siervo/siervo_end_file.php?id=${id}`)
    .then((response) => response.json())
    .then((songs) => {
      document.getElementById("title").value = songs.title || "";
      document.getElementById("artist").value = songs.artist || "";
      document.getElementById("album").value = songs.album || "";
      document.getElementById("release_year").value = songs.release_year;
      document.getElementById("genre").value = songs.genre || "";

      document.getElementById("add_music").dataset.id = id;
      document.getElementById("update_button").classList.remove("hidden");
      document.getElementById("add_button").classList.add("hidden");
    });
}
function deleteMusic(id) {
  fetch('https://restapi.hershive.com/siervo/siervo_end_file.php', {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      loadMusic();
    })
    .catch((error) => {
      console.error("Error deleting song:", error);
    });
}

function clearForm() {
  document.getElementById("add_music").reset();
  delete document.getElementById("add_music").dataset.id;
  document.getElementById("update_button").classList.add("hidden");
  document.getElementById("add_button").classList.remove("hidden");
}

loadMusic();