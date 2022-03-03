export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: UserAddress;
  phone: string;
  website: string;
  company: UserCompany;
  [key: string]: any;
}
export interface UserAddress {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: AddressGeo;
}
export interface AddressGeo {
  lat: string | number;
  lng: string | number;
}
export interface UserCompany {
  name: string;
  catchPhrase: string;
  bs: string;
}
export type NestedObj = UserAddress | UserCompany;
export function isUserAddress(object: unknown): boolean {
  return Object.prototype.hasOwnProperty.call(object, "geo") && Object.prototype.hasOwnProperty.call(object, "zipcode");
}
export function isUserCompany(object: unknown): boolean {
  return Object.prototype.hasOwnProperty.call(object, "bs") && Object.prototype.hasOwnProperty.call(object, "catchPhrase");
}
export class DefaultUser implements User {
  address: UserAddress = {
    street: '',
    suite: '',
    city: '',
    zipcode: '',
    geo: {
      lat: '',
      lng: '',
    },
  };
  company: UserCompany = {
    name: '',
    catchPhrase: '',
    bs: '',
  };
  email = '';
  id = 0;
  name = '';
  phone = '';
  username = '';
  website = '';
}
