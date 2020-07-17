import { Component, OnInit } from '@angular/core';
import { fadeInOut } from '../../services/animations';


@Component({
  selector: 'terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css'],
  animations: [fadeInOut]
})
export class TermsComponent implements OnInit {

  

  constructor() {
   
  }

  ngOnInit() {
  }

}
