import { Component, OnInit, AfterViewInit } from '@angular/core';
import io from "socket.io-client";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public letters: any[];
  private users: any[];
  public username: string;
  private game: string = "game1";

  private socket: any;

  public ngOnInit(): void {

    this.socket = io("http://localhost:3000");
  }

  public ngAfterViewInit(): void {
    this.socket.on("startgame", data => {
      this.letters = data;
      console.log(data)
    });
  }

  public join(): void {
    var username = this.username;
    var game = this.game;
    this.socket.emit('join', { username, game }, (error) => {
      if (error) {
        alert(error);
      }
    })
  }

  public onEnter(value: string) { this.username = value; }

}
