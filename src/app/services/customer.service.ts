import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Customer} from "../model/customer.model";
import {environment} from "../../environments/environment";
import {BankAccount} from "../model/account.model";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {


  constructor(private http:HttpClient) { }


  getCustomers(): Observable<Array<Customer>> {
    return this.http.get<Array<Customer>>(environment.backendHost + "/customersd");
  }

  searchCustomers(keyword: string): Observable<Array<Customer>> {
    return this.http.get<Array<Customer>>(environment.backendHost + "/customers/search?keyword="+ keyword)
  }

  saveCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(environment.backendHost + "/customers", customer);
  }

  deleteCustomer(id: number) {
    return this.http.delete(environment.backendHost + "/customers/"+ id);
  }

  customerAccounts(id: number ): Observable<BankAccount[]> {
    return this.http.get<Array<BankAccount>>(environment.backendHost + "/customers/accounts/" + id);
  }

}
