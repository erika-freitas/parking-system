(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcDuration(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        return `${min}m and ${sec}s`;
    }
    function parkingOccupancy() {
        function readCarInfo() {
            return localStorage.parkingOccupancy ? JSON.parse(localStorage.parkingOccupancy) : [];
        }
        function saveCarInfo(vehicles) {
            localStorage.setItem("parkingOccupancy", JSON.stringify(vehicles));
        }
        function addCarInfo(vehicle, saveNewCar) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${vehicle.name}</td>
        <td>${vehicle.plate}</td>
        <td>${vehicle.arrival}</td>
        <td>
          <button class="remove" data-plate="${vehicle.plate}"><i class="fa-regular fa-trash-can"></i></button>
        </td>
      `;
            (_a = row.querySelector(".remove")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                removeCarInfo(this.dataset.plate);
            });
            (_b = $("#parkingOccupancy")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (saveNewCar)
                saveCarInfo([...readCarInfo(), vehicle]);
        }
        function removeCarInfo(plate) {
            const { arrival, name } = readCarInfo().find(vehicle => vehicle.plate === plate);
            const duration = calcDuration(new Date().getTime() - new Date(arrival).getTime());
            if (!confirm(`The vehicle ${name} has been parked for ${duration}. Do you wish to check out?`))
                return;
            saveCarInfo(readCarInfo().filter((vehicle) => vehicle.plate !== plate));
            renderCarInfo();
        }
        function renderCarInfo() {
            $("#parkingOccupancy").innerHTML = "";
            const parkingOccupancy = readCarInfo();
            if (parkingOccupancy.length) {
                parkingOccupancy.forEach(vehicle => addCarInfo(vehicle));
            }
        }
        return { readCarInfo, saveCarInfo, addCarInfo, removeCarInfo, renderCarInfo };
    }
    parkingOccupancy().renderCarInfo();
    (_a = $("#register")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const name = (_a = $("#carName")) === null || _a === void 0 ? void 0 : _a.value;
        const plate = (_b = $("#carPlate")) === null || _b === void 0 ? void 0 : _b.value;
        if (!name || !plate) {
            alert("All fields are required");
            return;
        }
        parkingOccupancy().addCarInfo({ name, plate, arrival: new Date().toISOString() }, true);
    });
})();
