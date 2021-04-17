import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { NewPlayerComponent } from './new-player/new-player.component';
import { CardToImagePathPipe } from './card-to-image-path.pipe';

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent,
    NewPlayerComponent,
    CardToImagePathPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
