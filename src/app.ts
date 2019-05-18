import TemperatureObserver from "./TemperatureObserver";

const temperatureObserver = new TemperatureObserver();

temperatureObserver.on('onTempChange', (temp, oldTemp) => {
  console.log(temp, oldTemp, temp + oldTemp);
});
