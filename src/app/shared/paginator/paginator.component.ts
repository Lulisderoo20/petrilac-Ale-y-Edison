import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

export class Page {
  //The number of elements in the page
  size: number = 0;
  //The total number of elements
  totalElements: number = 0;
  //The total number of pages
  totalPages: number = 0;
  //The current page number
  pageNumber: number = 0;
}


@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})

export class PaginatorComponent implements OnInit {

  @Input() cardSelected: boolean = false;
  @Input() isPaginatorSmall: boolean = false;
  @Input() hidePageSize: boolean = false;
  @Output() searchEventEmitter = new EventEmitter();

  page: Page;
  pageSizeOptions: any;
  pageOfLabel: string;
  pageName: string;

  constructor(private paginator: MatPaginatorIntl) {

    this.initPage(10);

    this.paginatorPageConfiguration();
  }

  ngOnInit() {

  }

  initPage(size: any) {

    this.page = new Page();
    this.page.pageNumber = 0;
    this.page.size = size;
    this.page.totalElements = 0;
    this.pageSizeOptions = [10, 25, 50, 100];
  }

  paginatorPageConfiguration() {

    this.paginator.getRangeLabel = (page: number, pageSize: number, length: number) => {

      this.initTranslation();

      if (length === 0 || pageSize === 0) {
          return `${page + 1} ` + this.pageName;
      }
      length = Math.max(length, 0);
      let pageTotal = (length / pageSize);
      if (!Number.isInteger(pageTotal)) {
          pageTotal = Math.trunc(pageTotal) + 1;
      }
      return `${page + 1} ` + this.pageOfLabel + ` ${pageTotal} ` + this.pageName;
    }

  }

  initTranslation() {
    this.paginator.itemsPerPageLabel = 'Ítems por página';
    this.paginator.nextPageLabel = 'Siguiente';
    this.paginator.previousPageLabel = 'Anteriror';
    this.paginator.firstPageLabel = 'Primera página';
    this.paginator.lastPageLabel = 'Última página';
    this.pageOfLabel = 'de';
    this.pageName = 'páginas';
  }

  setPageForSearch(pageInfo: any) {

    this.page.pageNumber = pageInfo.pageIndex;
    const pageSizePrevious = this.page.size;
    this.page.size = pageInfo.pageSize;

    if (this.page.totalElements > this.page.size || this.page.totalElements > pageSizePrevious) {
        this.searchEventEmitter.emit();
    }
  }

  getPage() {
    return this.page;
  }

  setPage(page: any) {
    this.page = page;
  }

  getFirstResult() {
    return this.page.pageNumber * this.page.size;
  }

  getMaxResults() {
    return this.page.size;
  }

  setTotalElements(totalElements: any) {
    this.page.totalElements = totalElements;
    this.page.totalPages = this.page.totalElements / this.page.size;
  }

  setPageSize(size: any) {
    this.page.size = size;
  }

  resetPaginator(size: any) {

    this.initPage(size);

    this.paginatorPageConfiguration();

    try {
      var element: HTMLElement = document.getElementsByClassName('mat-paginator-navigation-first')[0] as HTMLElement;
      element.click();
    }
    catch (e) {
    }
  }

}
