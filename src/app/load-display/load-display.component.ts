import { Component, OnInit } from '@angular/core';
import {timer} from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-load-display',
  templateUrl: './load-display.component.html',
  styleUrls: ['./load-display.component.css']
})
export class LoadDisplayComponent implements OnInit {
  private interval;

  constructor(private location: Location) { this.interval = setInterval(() => {
    alert('Sorry, this page has timed out. Please try again later. Returning to the previous page.');
    this.location.back();
  }, 600000);
  }

  ngOnInit() {

  }
}
