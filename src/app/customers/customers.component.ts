import { Component, OnInit } from '@angular/core';
import {CustomerService} from "../services/customer.service";
import {Observable, throwError, catchError, map} from "rxjs";
import {Customer} from "../model/customer.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {BankAccount} from "../model/account.model";


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers! : Observable<Array<Customer>>;
  errorMessage : string | undefined;
  searchFormGroup : FormGroup | undefined;
  customerAccounts$! : Observable<Array<BankAccount>>;


  constructor(private customerService:CustomerService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
   this.searchFormGroup = this.fb.group({
     keyword: this.fb.control("")
   });
    this.handleSearchCustomers();
  }

  handleSearchCustomers() {
    let kw = this.searchFormGroup?.value.keyword;
    this.customers = this.customerService.searchCustomers(kw).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    )
  }

  handleDeleteCustomer(c: Customer) {
    let conf = confirm("Are you sure?");
    if(!conf) return;
    this.customerService.deleteCustomer(c.id).subscribe({
      next: (resp) => {
        this.customers = this.customers.pipe(
          map(data => {
           let index = data.indexOf(c);
           data.slice(index, 1);
            return data;
          })
        );
      },
      error : err => {
        console.log(err);
      }
    })
  }

  handleCustomerAccounts(customer: Customer) {
    // this.router.navigateByUrl("/customer-accounts/" + customer.id, {state: customer});
    this.customerAccounts$ = this.customerService.customerAccounts(customer.id).pipe(
      catchError( err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    )
  }

  handleEditCustomer(c: Customer) {
    console.log(c)
  }

  handleAccountOperations(b: BankAccount) {
    this.router.navigateByUrl("/accounts/" + b.id, {state: b});
  }
}
