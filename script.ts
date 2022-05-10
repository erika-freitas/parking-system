interface Ivehicle {
  name: string;
  plate: string;
  arrival: Date | string;
}

(function () {
  const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

  function calcDuration(mil: number) {
    const min = Math.floor(mil / 60000);
    const sec = Math.floor((mil % 60000) / 1000);

    return `${min}m and ${sec}s`;
  }

  function parkingOccupancy() {

    function readCarInfo(): Ivehicle[] {
      return localStorage.parkingOccupancy ? JSON.parse(localStorage.parkingOccupancy) : [];
    }

    function saveCarInfo(vehicles: Ivehicle[]) {
      localStorage.setItem("parkingOccupancy", JSON.stringify(vehicles));
    }

    function addCarInfo(vehicle: Ivehicle, saveNewCar?: boolean) {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${vehicle.name}</td>
        <td>${vehicle.plate}</td>
        <td>${vehicle.arrival}</td>
        <td>
          <button class="btn remove" data-plate="${vehicle.plate}">X</button>
        </td>
      `;

      row.querySelector(".remove")?.addEventListener("click", function(){
        removeCarInfo(this.dataset.plate);
      });

      $("#parkingOccupancy")?.appendChild(row);

      if(saveNewCar) saveCarInfo([...readCarInfo(), vehicle]);
    }

    function removeCarInfo(plate: string) {
      const {arrival, name} = readCarInfo().find(vehicle => vehicle.plate === plate);

      const duration = calcDuration(new Date().getTime() - new Date(arrival).getTime());

      if(
          !confirm(`The vehicle ${name} has been parked for ${duration}. Do you wish to check out?`)
        ) 
          return;

      saveCarInfo(readCarInfo().filter((vehicle) => vehicle.plate !== plate));
      renderCarInfo();
    }

    function renderCarInfo() {
      $("#parkingOccupancy")!.innerHTML = "";
      const parkingOccupancy = readCarInfo();

      if(parkingOccupancy.length){
        parkingOccupancy.forEach(vehicle => addCarInfo(vehicle));
      }
    }

    return { readCarInfo, saveCarInfo, addCarInfo, removeCarInfo, renderCarInfo };
  }

  parkingOccupancy().renderCarInfo();

  $("#register")?.addEventListener("click", () => {
    const name = $("#carName")?.value;
    const plate = $("#carPlate")?.value;

    if (!name || !plate) {
      alert("All fields are required");
      return
    }

    parkingOccupancy().addCarInfo({ name, plate, arrival: new Date().toISOString() }, true);
  })
})();