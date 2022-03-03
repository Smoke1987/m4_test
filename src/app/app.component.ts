import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { UsersQuery } from './state/users.query';
import { UsersService } from './state/users.service';
import { NgEntityServiceLoader } from '@datorama/akita-ng-entity-service';
import { DefaultUser, isUserAddress, isUserCompany, NestedObj, User, UserAddress, UserCompany } from './model/User';
import { Actions } from '@datorama/akita-ng-effects';
import { loadUsers } from './state/user.actions';
import { UserEffects } from './state/user.effects';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'm4-test';
  users$ = this.usersQuery.selectAll();
  loaders = this.loader.loadersFor('users');
  dynamicColumns: string[] = [];
  searchText = '';
  isTimerStarted = false;
  timerSubscription?: Subscription;
  timeout = 30;
  constructor(private apiService: ApiService,
              private usersQuery: UsersQuery,
              private usersService: UsersService,
              private loader: NgEntityServiceLoader,
              private actions: Actions,
              private usersEffects: UserEffects,
              public dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    this.usersEffects.loadUsers$.subscribe((data) => {
      if (data?.users.length) {
        this.dynamicColumns = Object.keys(data.users[0]);
      }
    });
    this.actions.dispatch(loadUsers());
  }

  findColumnValue(user: User, _colName: string): string {
    let value = eval(`user.${_colName}`);
    if (typeof value === 'object') {
      value = this.getNestedValue(value, _colName);
    }
    return value;
  }

  getNestedValue(value: NestedObj, colName: string): string {
    let result = JSON.stringify(value);
    const isAddress = isUserAddress(value);
    const isCompany = isUserCompany(value);
    if (isAddress) {
      const _address = value as UserAddress;
      result = `${_address.zipcode}, ${_address.city}, ${_address.street}, ${_address.suite} (${_address.geo.lat}:${_address.geo.lng})`;
    } else if (isCompany) {
      const _company = value as UserCompany;
      result = `${_company.name} \n ${_company.bs} (${_company.catchPhrase})`;
    }
    return result;
  }

  addUser(): void {
    this.openDialog(new DefaultUser(), 'add');
  }

  addRandomUser() {
    let randomUser: User = {
      id: Math.round(Math.random() * 20),
      name: 'RandomName',
      username: 'RandomUserName',
      email: 'random@mail.com',
      address: {
        geo: {
          lat: 10.1122,
          lng: 23.2222
        },
        street: 'RandomStreet',
        suite: 'RandomSuite',
        city: 'RandomCity',
        zipcode: 'RandomZIPCode'
      },
      phone: 'RandomPhone',
      website: 'RandomWedSite',
      company: {
        name: 'RandomCompanyName',
        catchPhrase: 'RandomCatchPhrases',
        bs: 'RandomBS',
      }
    };
    this.usersService.addUser(randomUser);
  }

  search($event: string): void {
    this.searchText = $event;
    this.users$ = this.usersQuery.selectAll({
      filterBy: this.filterData.bind(this)// entity => entity.completed === true
    });
  }

  refreshData(): void {
    if (this.timerSubscription && !this.timerSubscription.closed) {
      this.timerSubscription.unsubscribe();
    } else {
      const source = timer(0, 1000);
      this.isTimerStarted = true;
      this.timerSubscription = source.subscribe((val) => {
        this.timeout -= 1;
        if (this.timeout == 0) {
          this.timerSubscription?.unsubscribe();
          this.isTimerStarted = false;
          this.timeout = 30;
          this.addRandomUser();
        }
      });
    }
  }

  editUser(user?:any): void {
    this.openDialog(user);
  }

  removeUser(user: User): void {
    this.usersService.removeUser(user.id);
  }

  filterData(entity: User): boolean {
    return this.filterObj(entity, this.searchText);
  }

  filterObj(obj: any, text: string): boolean {
    let result = false;
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (typeof obj[key] === 'object') {
        result = this.filterObj(obj[key], text);
      } else if (typeof obj[key] === 'string') {
        result = obj[key].toLowerCase().indexOf(text.toLowerCase()) > -1;
      } else {
        result = obj[key] == text;
      }
      if (result) {
        break;
      }
    }
    return result;
  }

  openDialog(user: User, mode = 'edit'): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '50%',
      data: {user: JSON.parse(JSON.stringify(user)), mode},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      if (result.mode === 'edit') {
        this.usersService.updateUser(user.id, result.user);
      } else {
        this.usersService.addUser(result.user);
      }
    });
  }
}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog implements OnInit {
  form: FormGroup = new FormGroup({});
  fields: string[] = [];
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: {user: User, mode: string},
    private _fb: FormBuilder,
  ) {

  }

  isGroup(field: string, formGroup?: FormGroup): boolean {
    if (!formGroup) {
      formGroup = this.form;
    }
    return formGroup.get(field) instanceof FormGroup;
  }

  getNestedGroupKeys(field: string, groupName?: string): string[] {
    let _abstractControl, _result;
    if (groupName) {
      _abstractControl = (this.form.get(groupName) as FormGroup).get(field);
      _result = Object.keys((_abstractControl as FormGroup).controls).map(_value => `${_value}`);
    } else {
      _abstractControl = this.form.get(field);
      _result = Object.keys((_abstractControl as FormGroup).controls);
    }
    return _result;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }

  onSubmit() {
    this.validateAllFormFields(this.form);
    if (this.form.valid) {
      let result: any = {};
      Object.keys(this.form.value).forEach(_key => {
        result[_key] = this.form.value[_key];
      });
      this.dialogRef.close({user: this.form.value, mode: this.data.mode});
    }
  }

  ngOnInit(): void {
    this.fields = Object.keys(this.data.user);
    let formGroup: any = {};
    this.fields.forEach( key => {
      const value = eval(`this.data.user.${key}`);
      if (typeof value === 'object') {
        formGroup[key] = this.getFormGroup(value, key);
      } else {
        formGroup[key] = this.getFromControl(value, key);
      }
    });
    this.form = new FormGroup(formGroup);
  }

  getFromControl(value: any, key: string): FormControl {
    return this._fb.control(value, Validators.required);
  }

  getFormGroup(value: any, key: string): FormGroup {
    const group: any = {};

    Object.keys(value).forEach(_key => {
      const nestedValue = eval(`value.${_key}`);
      if (typeof nestedValue === 'object') {
        group[_key] = this.getFormGroup(nestedValue, _key);
      } else {
        group[_key] = new FormControl(nestedValue, Validators.required);
      }
    });
    return new FormGroup(group);
  }
}
