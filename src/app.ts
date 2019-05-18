import TemperatureObserver from "./TemperatureObserver";
import CoolerManager from "./CoolerManager";

const temperatureSlopeConstant = 0.65 / 15;
const temperatureXOffset = 45;
const temperatureYOffset = 0.4;

const temperatureObserver = new TemperatureObserver();

const coolerManager = new CoolerManager();

function getCoolerSpeedAccordingToTemperature(temperature: number) {
  return temperatureSlopeConstant * (temperature - temperatureXOffset) + temperatureYOffset;
}

temperatureObserver.on('onTempChange', (temp) => {
  const coolerSpeed = getCoolerSpeedAccordingToTemperature(temp);
  coolerManager.setSpeed(coolerSpeed);
});
