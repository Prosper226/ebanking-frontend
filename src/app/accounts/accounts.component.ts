import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AccountService} from "../services/account.service";
import {Observable, catchError, throwError} from "rxjs";
import {AccountDetails} from "../model/account.model";
import {ActivatedRoute, Route} from "@angular/router";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  currentPage : number = 0;
  pageSize : number = 5;
  account$! : Observable<AccountDetails>

  accountSearchFormGroup! : FormGroup;
  operationFormGroup! : FormGroup;
  errorMessage! : string;

  constructor(private fb: FormBuilder, private accountService: AccountService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if(this.route.snapshot.params['id']){
      this.handleSearchAccount(this.route.snapshot.params['id']);
    }
    this.accountSearchFormGroup = this.fb.group({
      accountId: this.fb.control("")
    });
    this.operationFormGroup = this.fb.group({
      operationType: this.fb.control(null),
      amount: this.fb.control(0),
      description: this.fb.control(null),
      accountDestination: this.fb.control(null)
    });
  }

  handleSearchAccount(accountId = '') {
    if(accountId == ''){
      accountId = this.accountSearchFormGroup.value.accountId;
    }
    this.account$ = this.accountService.getAccount(accountId,this.currentPage, this.pageSize).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );
  }

  gotoPage(page: number, accountId: string = '') {
    this.currentPage = page;
    this.handleSearchAccount(accountId);
  }

  handleAccountOperation() {
    let accountId: string = this.accountSearchFormGroup.value.accountId;
    if(this.route.snapshot.params['id']){
      accountId = this.route.snapshot.params['id'];
    }
    let operationType :string = this.operationFormGroup.value.operationType;
    let amount :number = this.operationFormGroup.value.amount;
    let description : string = this.operationFormGroup.value.description;
    let accountDestination : string = this.operationFormGroup.value.accountDestination;
    if(operationType == 'DEBIT'){
        this.accountService.debit(accountId, amount, description).subscribe({
          next: (data) => {
            alert("Success Debit");
            this.handleSearchAccount(accountId);
            this.operationFormGroup.reset();
          },
          error: (err) => {
            console.log(err);
          }
        });
    } else if(operationType == 'CREDIT'){
      this.accountService.credit(accountId, amount, description).subscribe({
        next: (data) => {
          alert("Success credit");
          this.handleSearchAccount(accountId);
          this.operationFormGroup.reset();
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else if(operationType == 'TRANSFER'){
      this.accountService.transfer(accountId, accountDestination, amount, description).subscribe({
        next: (data) => {
          alert("Success transfer");
          this.handleSearchAccount(accountId);
          this.operationFormGroup.reset();
        },
        error: (err) => {
          console.log(err);
        }
      });
    }



  }
}
