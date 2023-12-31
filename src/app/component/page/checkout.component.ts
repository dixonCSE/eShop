import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { CartStateService } from 'src/app/state/cart.state.service';
import { MaterialModule } from 'src/app/material.module';
import { CartItemComponent } from '../cart-item.component';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CartService } from 'src/app/service/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStateService } from 'src/app/state/user.state.service';

@Component({
    selector: 'checkout-component',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModule,
        CartItemComponent,
        ReactiveFormsModule,
    ],
    styles: [],
    template: `
        <style>
            * {
                color: #000;
            }
            mat-card-content {
            }
            table {
                width: 100%;
            }
            td {
                border-bottom: 1px solid rgba(125, 125, 125, 0.5);
            }

            .Form {
                min-width: 300px;
                margin: 20px auto;
            }
            mat-form-field {
                width: 100%;
            }
            mat-card-title {
                text-align: center;
                margin: 10px auto 20px;
            }
            mat-card-actions {
                justify-content: center;
            }

            .loading-shade {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.2);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        </style>

        <mat-card class="mb-2">
            <mat-card-content>Checkout</mat-card-content>
        </mat-card>

        <div class="mb-2">
            <mat-card>
                <mat-card-content>
                    <table>
                        <thead>
                            <tr>
                                <th class="text-left">Item</th>
                                <th class="text-left">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                *ngFor="
                                    let item of _cartStateService.cartItems();
                                    let i = index
                                "
                            >
                                <td class="text-left">
                                    <div>{{ item.name | titlecase }}</div>
                                    <div>{{ item.price }} X {{ item.qty }}</div>
                                </td>
                                <td class="text-left">
                                    {{ item.price * item.qty | currency }}
                                </td>
                            </tr>
                            <tr>
                                <td class="text-left text-green-500">
                                    <div>Total</div>
                                </td>
                                <td class="text-left text-green-500">
                                    {{
                                        _cartStateService.totalPrice()
                                            | currency
                                    }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </mat-card-content>
            </mat-card>
        </div>

        <section>
            <form class="Form" [formGroup]="form" (ngSubmit)="onSubmit()">
                <div class="loading-shade" *ngIf="isLoading">
                    <mat-spinner *ngIf="isLoading"></mat-spinner>
                </div>
                <mat-card>
                    <mat-card-title> Chackout Info </mat-card-title>
                    <mat-card-content>
                        <p>
                            <mat-form-field
                                appearance="outline"
                                hideRequiredMarker
                            >
                                <mat-label> Full Name </mat-label>
                                <input
                                    matInput
                                    #username
                                    type="text"
                                    id="username"
                                    formControlName="username"
                                    placeholder="Full Name"
                                />
                            </mat-form-field>
                        </p>
                        <p>
                            <mat-form-field
                                appearance="outline"
                                hideRequiredMarker
                            >
                                <mat-label> Email </mat-label>
                                <input
                                    matInput
                                    #email
                                    type="text"
                                    id="email"
                                    formControlName="email"
                                    placeholder="Email"
                                />
                            </mat-form-field>
                        </p>
                        <p>
                            <mat-form-field
                                appearance="outline"
                                hideRequiredMarker
                            >
                                <mat-label> Phone </mat-label>
                                <input
                                    matInput
                                    #phone
                                    type="text"
                                    id="phone"
                                    formControlName="phone"
                                    placeholder="Phone"
                                />
                            </mat-form-field>
                        </p>
                        <p>
                            <mat-form-field
                                appearance="outline"
                                hideRequiredMarker
                            >
                                <mat-label> Address </mat-label>

                                <textarea
                                    matInput
                                    matInput
                                    #address
                                    id="address"
                                    formControlName="address"
                                    cdkTextareaAutosize
                                    #autosize="cdkTextareaAutosize"
                                    cdkAutosizeMinRows="1"
                                    cdkAutosizeMaxRows="5"
                                >
                                </textarea>
                            </mat-form-field>
                        </p>

                        <p>
                            <mat-form-field
                                appearance="outline"
                                hideRequiredMarker
                            >
                                <mat-label> Pick point </mat-label>

                                <mat-select
                                    #pickPoint
                                    id="pickPoint"
                                    formControlName="pickPoint"
                                >
                                    <mat-option
                                        *ngFor="let element of pickPoints"
                                        [value]="element.name"
                                    >
                                        {{ element.name }}
                                    </mat-option>
                                </mat-select>
                            </mat-form-field>
                        </p>
                    </mat-card-content>
                    <mat-card-actions>
                        <button
                            type="submit"
                            mat-raised-button
                            color="primary"
                            [disabled]="!form.valid || !isSubmitBtnEnable"
                        >
                            Submit
                        </button>
                    </mat-card-actions>
                </mat-card>
            </form>
        </section>
    `,
})
export class CheckoutComponent implements OnInit {
    form: FormGroup = new FormGroup({});
    isSubmitBtnEnable = true;
    isLoading = false;

    email: string | null = null;
    phone: string | null = null;

    pickPoints: any[] = [];

    constructor(
        public _cartStateService: CartStateService,
        private _cartService: CartService,
        private fb: FormBuilder,
        private _snackBar: MatSnackBar,
        private _router: Router,
        public _userStateService: UserStateService
    ) {
        //
    }

    ngOnInit(): void {
        this.email = this._userStateService.user()?.email ?? null;
        this.phone = this._userStateService.user()?.phone ?? null;
        this.form = this.fb.group({
            username: ['', [Validators.required]],
            email: [this.email],
            phone: [
                this.phone,
                [Validators.required, Validators.pattern('[0][1][0-9]{9}')],
            ],
            address: ['', [Validators.required]],
            pickPoint: ['', [Validators.required]],
        });

        console.log(this._userStateService.user()?.phone);

        this._cartService.pickPoint().subscribe(
            (res) => {
                if (res.type == 'success') {
                    this.pickPoints = res.data;
                }
            },
            (err) => {
                console.log(err);
            }
        );
    }

    onSubmit() {
        this.isLoading = true;
        this.isSubmitBtnEnable = false;

        let user_order_item: any = [];

        this._cartStateService.cartItems().forEach((currentValue, index) => {
            user_order_item.push({
                product_id: currentValue.id,
                qty: currentValue.qty,
            });
        });

        let reqdata = {
            username: this.form.value.username,
            phone: this.form.value.phone,
            email: this.form.value.email,
            address: this.form.value.address,
            pickpoint: this.form.value.pickPoint,
            user_order_item: user_order_item,
        };

        this._cartService.checkout(reqdata).subscribe(
            (res) => {
                this.isLoading = false;
                this.isSubmitBtnEnable = true;
                console.log(res);

                if (res.type == 'success') {
                    this._cartStateService.clearCart();
                    this._snackBar.open('successfully added ', '', {
                        duration: 1.2 * 1000,
                        horizontalPosition: 'start',
                        verticalPosition: 'bottom',
                    });

                    this._router.navigate(['checkout-complete', res.data.id]);
                } else {
                    this._snackBar.open('error in checkout ', '', {
                        duration: 1.2 * 1000,
                        horizontalPosition: 'start',
                        verticalPosition: 'bottom',
                    });
                }
            },
            (err) => {
                this.isSubmitBtnEnable = true;
                console.log(err);
            }
        );
    }
}
