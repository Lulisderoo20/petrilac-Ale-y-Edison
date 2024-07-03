import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css']
})
export class ActionBarComponent implements OnInit {

  @Input() title: string;
  @Input() actionBackEnabled: boolean = true;

  constructor(
    private location: Location,
  ) {}

  ngOnInit(): void {
  }

  back() {
    this.location.back();
  }
}
