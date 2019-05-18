import { PWM } from 'raspi-pwm';

export default class CoolerManager {
  private coolerPWM: PWM = new PWM('P1-12');

  private currentSpeed: number = 0;

  public get speed(): number {
    return this.currentSpeed;
  }
  
  public setSpeed(requestedSpeed: number): void {
    const speed = Math.min(Math.abs(requestedSpeed), 1);

    if (speed < 0.4) {
      this.currentSpeed = 0;
      this.coolerPWM.write(0);
      return;
    }

    this.currentSpeed = speed;
    this.coolerPWM.write(speed);
  }
}
