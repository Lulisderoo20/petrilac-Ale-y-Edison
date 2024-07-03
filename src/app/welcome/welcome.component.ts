import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  signup: boolean = false;
  registration: boolean = false;
  awardImages: any[] = new Array();

  constructor() {
  
  }

  ngOnInit(): void {

    for (let i = 1; i <= 10; i++) {
      this.awardImages.push({src: '/assets/image/awards/'+i+'.png'});
    }
  }

  clickSignup() {

    this.signup = true;
    this.registration = false;
  }

  clickRegister() {

    this.registration = true;
    this.signup = false;

    setTimeout(() => {
      document.getElementById("registrationComponent").scrollIntoView();
    }, 0);
  }
    
}
