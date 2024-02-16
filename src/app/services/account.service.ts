import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {AccountDetails} from "../model/account.model";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  getAccount(accountId: string, page: number, size: number): Observable<AccountDetails>{
    return this.http.get<AccountDetails>(environment.backendHost+ "/accounts/" + accountId +"/pageOperations?page="+page+ "&size=" +size);
  }

  debit(accountId: string, amount: number, description: string): Observable<any>{
    let data = { accountId : accountId, amount: amount, description: description}
    return this.http.post(environment.backendHost+ "/accounts/debit", data);
  }

  credit(accountId: string, amount: number, description: string): Observable<any>{
    let data = { accountId : accountId, amount: amount, description: description}
    return this.http.post(environment.backendHost+ "/accounts/credit", data);
  }

  transfer(accountSource: string, accountDestination: string, amount: number, description: string): Observable<any>{
    let data = {accountSource, accountDestination, amount, description}
    return this.http.post(environment.backendHost+ "/accounts/transfer", data);
  }

}
