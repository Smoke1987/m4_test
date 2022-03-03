import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, DialogOverviewExampleDialog } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { ActionBlockComponent } from './components/action-block/action-block.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';
import { NG_ENTITY_SERVICE_CONFIG } from '@datorama/akita-ng-entity-service';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { UserEffects } from './state/user.effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserFilterPipe } from './pipes/user.filter';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    ActionBlockComponent,
    UserFilterPipe,
    DialogOverviewExampleDialog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AkitaNgEffectsModule.forRoot([UserEffects]),
    OverlayModule,
    MatGridListModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  providers: [{
    provide: NG_ENTITY_SERVICE_CONFIG,
    useValue: {
      baseUrl: 'https://jsonplaceholder.typicode.com'
    }
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
