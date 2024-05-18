const { fetchData } = require("./fetchData");
const { converDatetoGetTime } = require("./converDateToGetTime");

document.addEventListener("DOMContentLoaded", function () {
  let submit = document.getElementById("submit");
  submit.addEventListener("click", async function (event) {
    event.preventDefault();
    document.querySelector(".error").textContent = "";
    this.disabled = true;

    // Form Input Variables
    let search = document.getElementById("name").value;
    let date = document.getElementById("date").value;
    let location = search.replaceAll(" ", "+");

    // Convert time to milliseconds
    const currentTime = await converDatetoGetTime();
    const selectedTime = await converDatetoGetTime(date);

    // Validation - Required Input Fields
    if (search.length === 0 || date.length === 0) {
      alert("Date and destination fields are required.");
      this.disabled = false;
      return;
    }

    // Validation date
    if (currentTime > selectedTime) {
      // Fetch APIs
      let data = await fetchData(`http://localhost:8080/`, {
        location,
        date,
      });
      if (data) {
        this.disabled = false;

        // Output
        const itemsDiv = document.createElement("div");
        itemsDiv.className = "items";
        const img = document.createElement("img");
        img.src = data.image;
        img.alt = "";

        const h1 = document.createElement("h1");
        h1.textContent = "Name";
        const h2 = document.createElement("h2");
        h2.textContent = `Departing: ${date}`;

        const p1 = document.createElement("p");
        p1.textContent = "Your trip is 2 days away";

        const p2 = document.createElement("p");
        p2.textContent = `Weather is expected to be : ${data.weather.description}`;

        const p3 = document.createElement("p");
        p3.textContent = `Temperature is expected to be: ${data.temp}C`;

        const button = document.createElement("button");
        button.className = "delete";
        button.textContent = "Delete";

        itemsDiv.appendChild(img);
        itemsDiv.appendChild(h1);
        itemsDiv.appendChild(h2);
        itemsDiv.appendChild(p1);
        itemsDiv.appendChild(p2);
        itemsDiv.appendChild(p3);
        itemsDiv.appendChild(button);

        document.getElementById("result").appendChild(itemsDiv);
      }
    } else {
      this.disabled = false;

      // Error The current time is greater than the selected time.
      document.querySelector(".error").textContent =
        "The current time is greater than the selected time.";
    }
  });

  // Delete event
  document.querySelector(".result").addEventListener("click", function (event) {
    if (event.target.classList.contains("delete")) {
      event.target.parentNode.remove();
    }
  });
});
