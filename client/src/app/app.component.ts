import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { AccountService } from './_services/account.service';
import { HomeComponent } from "./home/home.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent],
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
    const user = JSON.parse(usrString);
    this.accountService.currentUser.set(user);
  }

  
}
