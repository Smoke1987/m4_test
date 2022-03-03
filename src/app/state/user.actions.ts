import { createAction, props } from '@datorama/akita-ng-effects';
import { User } from '../model/User';

export const loadUsers = createAction('[Users] Load and save');

export const loadUsersSuccess = createAction(
  '[Users] Loaded and saved',
  props<{ users: User[] }>()
);
