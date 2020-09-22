import { Pipe, PipeTransform, ChangeDetectorRef, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { getTranslation } from 'src/helpers/utils';

@Pipe({
  name: 'dateAgo',
  pure: false,
})
export class DateAgoPipe implements PipeTransform {
  private timer: number;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private translate: TranslateService
  ) {}
  transform(value: string) {
    this.removeTimer();
    let d = new Date(value);
    let now = new Date();
    let seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
    let timeToUpdate = Number.isNaN(seconds) ? 1000 : this.getSecondsUntilUpdate(seconds) * 1000;
    this.timer = this.ngZone.runOutsideAngular(() => {
      if (typeof window !== 'undefined') {
        return window.setTimeout(() => {
          this.ngZone.run(() => this.changeDetectorRef.markForCheck());
        }, timeToUpdate);
      }
      return null;
    });
    let minutes = Math.round(Math.abs(seconds / 60));
    let hours = Math.round(Math.abs(minutes / 60));
    let days = Math.round(Math.abs(hours / 24));
    let weeks = Math.round(Math.abs(days / 7));
    let months = Math.round(Math.abs(days / 30.416));
    let years = Math.round(Math.abs(days / 365));
    let justNow: string = getTranslation('just now', this.translate);
    let oneMinute: string = getTranslation('1 minute ago', this.translate);
    let minutesAgo: string = getTranslation('minutes ago', this.translate, { minutes: minutes });
    let oneHour: string = getTranslation('1 hour ago', this.translate);
    let hourAgo: string = getTranslation('hours ago', this.translate, { hours: hours });
    let oneDay: string = getTranslation('1 day ago', this.translate);
    let dayAgo: string = getTranslation('days ago', this.translate, { days: days });
    let oneWeek: string = getTranslation('1 week ago', this.translate);
    let weekAgo: string = getTranslation('weeks ago', this.translate, { weeks: weeks });
    let oneMonth: string = getTranslation('a month ago', this.translate);
    let monthAgo: string = getTranslation('months ago', this.translate, { months: months });
    let oneYear: string = getTranslation('a year ago', this.translate);
    let yearAgo: string = getTranslation('years ago', this.translate, { years: years });
    if (Number.isNaN(seconds)) {
      return '';
    } else if (seconds <= 45) {
      return justNow;
    } else if (seconds <= 90) {
      return oneMinute;
    } else if (minutes <= 45) {
      return minutesAgo;
    } else if (minutes <= 90) {
      return oneHour;
    } else if (hours <= 23) {
      return hourAgo;
    } else if (hours <= 25) {
      return oneDay;
    } else if (days <= 6) {
      return dayAgo;
    } else if (days <= 13) {
      return oneWeek;
    } else if (weeks <= 3) {
      return weekAgo;
    } else if (days <= 45) {
      return oneMonth;
    } else if (days <= 345) {
      return monthAgo;
    } else if (days <= 545) {
      return oneYear;
    } else {
      // (days > 545)
      return yearAgo;
    }
  }
  ngOnDestroy(): void {
    this.removeTimer();
  }
  private removeTimer() {
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }
  private getSecondsUntilUpdate(seconds: number) {
    let min = 60;
    let hr = min * 60;
    let day = hr * 24;
    if (seconds < min) {
      // less than 1 min, update every 2 secs
      return 2;
    } else if (seconds < hr) {
      // less than an hour, update every 30 secs
      return 30;
    } else if (seconds < day) {
      // less then a day, update every 5 mins
      return 300;
    } else {
      // update every hour
      return 3600;
    }
  }
}
