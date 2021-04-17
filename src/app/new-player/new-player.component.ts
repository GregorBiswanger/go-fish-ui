import { GameService } from './../game.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-player',
  templateUrl: './new-player.component.html',
  styleUrls: ['./new-player.component.scss']
})
export class NewPlayerComponent implements OnInit {
  playername = '';

  constructor(private router: Router, private gameService: GameService) { }

  ngOnInit() {
    this.gameService.started.subscribe(() => {
      this.router.navigate(['game-board']);
    });
  }

  startGame() {
    this.gameService.startGame(this.playername);
  }
}
