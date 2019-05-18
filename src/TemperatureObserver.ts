import { EventEmitter } from 'events';
import { readFile } from 'fs';

declare interface TemperatureObserver {
  on(event: 'onTempChange', listener: (temp: number, oldTemp: number) => void): this;
}

class TemperatureObserver extends EventEmitter {
  private currentTemp: number = 0;

  private async getTemp(): Promise<number | null> {
    return new Promise((resolve, reject) => {
      readFile('/sys/class/thermal/thermal_zone0/temp', 'utf-8', (err, data) => {
        if (!err) {
          resolve(parseInt(data));
          return;
        }

        switch (err.code) {
          case 'ENOENT': {
            throw new Error('Could not find /sys/class/thermal/thermal_zone0/temp, It seems unsupported OS');
          }

          default: {
            reject(err);
          }
        }
      })
    });
  }

  private tempCheckingIntervalId: NodeJS.Timeout | undefined;

  private startObserving(interval: number): void {
    this.tempCheckingIntervalId = setInterval(async() => {
      const temp = await this.getTemp();
      if (!temp) {
        console.error('Error while getting temperature');
        return;
      }

      if (this.currentTemp === temp) {
        return;
      }

      this.emit('onTempChange', temp, this.currentTemp);
      this.currentTemp = temp;
    }, interval);
  }

  private stopObserving(): void {
    if (!this.tempCheckingIntervalId) {
      return;
    }

    clearInterval(this.tempCheckingIntervalId);
  }

  public constructor(observingInterval?: number) {
    super();

    this.startObserving(observingInterval || 5000);
  }

  public get temp(): number {
    return this.currentTemp;
  }
}

export default TemperatureObserver;
