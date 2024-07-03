import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ScheduledLotteryService } from 'src/app/api/service/scheduledLottery.service';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.css']
})
export class CountdownTimerComponent implements OnInit {

  private subscription: Subscription;
  
  dateNow = new Date();
  scheduledDate = new Date();

  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute  = 60;
  timeDifference: number = 0;
  secondsToDday: number = 0;
  minutesToDday: number = 0;
  hoursToDday: number = 0;
  daysToDday: number = 0;

  constructor(private scheduledLotteryService: ScheduledLotteryService) {

  }

  private getTimeDifference() {

    this.timeDifference = this.scheduledDate.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference) {

    this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    this.secondsToDday = this.secondsToDday > 0 ? this.secondsToDday : 0;

    this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    this.minutesToDday = this.minutesToDday > 0 ? this.minutesToDday : 0;

    this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    this.hoursToDday = this.hoursToDday > 0 ? this.hoursToDday : 0;

    this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
    this.daysToDday = this.daysToDday > 0 ? this.daysToDday : 0;
  }

  ngOnInit() {

    this.scheduledDate = new Date();

    this.scheduledLotteryService.findScheduledLotteryValid().subscribe(result => {

      if (result && result.scheduledDate) {

        this.scheduledDate = new Date(result.scheduledDate);
      }

      this.initCountdown();
    }
    , error => {

      this.initCountdown();
    });
  }

  initCountdown() {

    this.subscription = interval(1000)
        .subscribe(x => { this.getTimeDifference(); });
  }

  ngOnDestroy() {

    this.subscription.unsubscribe();
  }

}

