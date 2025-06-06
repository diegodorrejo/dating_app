import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { AccountService } from './_services/account.service';
import { HomeComponent } from "./home/home.component";
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private accountService = inject(AccountService);


  ngOnInit(): void {
    this.setCurrentUser()
  }

  setCurrentUser(){
    const usrString = localStorage.getItem('user');
    if(!usrString) return;
    this.accountService.setCurrentUser(JSON.parse(usrString));
  }

  
}
