import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent implements OnInit {

  @Input() filter: any;
  @Input() isAdvanced: any = false;
  @Input() displaySearchAdvanced: any = false;
  @Input() isShowClear: any = false;
  @Input() isShowDefaultFilter: any = false;
  @Input() enableSearchAdvancedField: any = true;
  @Input() collectingEntityOptions: any[] = null;
  @Input() hideOptionAllCollectingEntity: boolean = false;
  @Input() isDatePeriod: boolean = false;
  @Input() showDates: boolean = true;

  isShowClosed: boolean = false;

  @Output() searchEventEmitter = new EventEmitter();
  @Output() clearEventEmitter = new EventEmitter();

  dateFromInvalid = false;
  dateToInvalid = false;
  dateFromTodayInvalid = false;

  generalFilter: any;
  generalFilterEnabled = false;

  constructor(protected sessionStorageService: SessionStorageService) {

    this.initGeneralFilter();
  }

  ngOnInit() {

    const storedFilter = this.sessionStorageService.retrieve('admin-filter');
    if (storedFilter) {

      this.generalFilterEnabled = storedFilter.enabled;

      if (this.generalFilterEnabled) {
          this.generalFilter = storedFilter;

          if (storedFilter.from !== null) {
            this.generalFilter.from = new Date(storedFilter.from);
          }

          if (storedFilter.to !== null) {
              this.generalFilter.to = new Date(storedFilter.to);
          }

          this.shareGeneralFilter();
        }
    }

  }

  clean() {

    this.clearEventEmitter.emit(this.filter)
    this.cleanDateInvalid();

    this.initGeneralFilter();
    this.generalFilter.enabled = this.generalFilterEnabled;
    this.sessionStorageService.store('admin-filter', this.generalFilter);
  }

  search() {

    if (this.validateDate()) {
        this.storeGeneralFilter();
        this.searchEventEmitter.emit(this.filter);
    }
  }

  validateDate(): boolean {

    this.cleanDateInvalid();

    if (this.filter.from != null && this.filter.to != null) {
      if (this.filter.from > this.filter.to) {
          this.dateFromInvalid = true;
          this.dateToInvalid = true;
          return false;
      }
    }
    return true;
  }

  cleanDateInvalid() {
    this.dateFromInvalid = false;
    this.dateToInvalid = false;
    this.dateFromTodayInvalid = false;
  }

  initGeneralFilter() {

    this.generalFilter = <any> {
      enabled: null,
      from: null,
      to: null,
    };
  }

  shareGeneralFilter() {

    this.filter.from = this.generalFilter.from;
    this.filter.to = this.generalFilter.to;
  }

  storeGeneralFilter() {

    this.generalFilter.enabled = this.generalFilterEnabled;

    if (this.generalFilterEnabled) {
        this.generalFilter.from = this.filter.from;
        this.generalFilter.to = this.filter.to;
    }

    this.sessionStorageService.store('admin-filter', this.generalFilter);
  }

  onChangeGeneralFilter() {

    this.storeGeneralFilter();
  }

}
