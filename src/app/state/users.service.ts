import { Injectable } from '@angular/core';
import { NgEntityService, NgEntityServiceConfig } from '@datorama/akita-ng-entity-service';
import { UsersStore, UsersState } from './users.store';
import { Observable } from 'rxjs';
import { User } from '../model/User';

@NgEntityServiceConfig({
  resourceName: 'users',
})
@Injectable({ providedIn: 'root' })
export class UsersService extends NgEntityService<UsersState> {

  constructor(protected store: UsersStore) {
    super(store);
  }

  loadUsers(): Observable<User[]> {
    return this.get();
  }

  updateUser(userId: number, newUser: User): void {
    this.store.update(userId, newUser);
  }

  addUser(newUser: User): void {
    this.store.add(newUser);
  }

  removeUser(userId: number): void {
    this.store.remove(userId);
  }
}
