import { GameBoardComponent } from './game-board/game-board.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPlayerComponent } from './new-player/new-player.component';

const routes: Routes = [
  { path: '', component: NewPlayerComponent },
  { path: 'game-board', component: GameBoardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
