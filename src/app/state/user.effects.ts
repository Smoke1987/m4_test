import { Actions, createEffect, ofType } from '@datorama/akita-ng-effects';
import { Injectable } from '@angular/core';
import { UsersService } from './users.service';
import { delay, map, switchMap } from 'rxjs/operators';
import { loadUsers, loadUsersSuccess } from './user.actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UsersService,
  ) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      switchMap((_) =>
        this.userService.loadUsers().pipe(
          map((users) => loadUsersSuccess({ users })),
        )
      )
    ), { dispatch: true }
  );

  /*/
  // Or use the decorator
  @Effect()
  loadMainNavigationSuccess$ = this.actions$.pipe(
    ofType(loadMainNavigationSuccess),
    map(({ mainNav }) => this.navigationService.updateNavigationTree(mainNav)),
    tap((mainRoutes) => this.store.updateNavigation(mainRoutes))
  );
  //*/
}
