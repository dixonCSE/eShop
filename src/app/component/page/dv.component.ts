import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductListComponent } from '../product-list.component';
import { CategoryService } from 'src/app/service/category.service';
import { CatScrollComponent } from '../cat-scroll.component';
import { SliderComponent } from '../slider.component';
import { ProductService } from 'src/app/service/product.service';

@Component({
    selector: 'dv-component',
    standalone: true,
    imports: [
        CommonModule,
        ProductListComponent,
        RouterLink,
        CatScrollComponent,
        SliderComponent,
    ],
    styles: [],
    template: `
        <style>
            .twg {
                background-color: brown;
            }
            a {
                text-decoration: none;
            }
        </style>

        <section *ngFor="let item of displayView">
            <div class="text-center text-amber-500 font-bold text-2xl my-5  ">
                {{ item.name }}
            </div>
            <product-list
                [key_code]="item.key_code"
                [is_page]="true"
            ></product-list>
            <div>
                <div></div>
                <div></div>
            </div>
        </section>
    `,
})
export class DvComponent implements OnInit {
    displayView: any;
    dvId: number = 0;

    constructor(
        private _categoryService: CategoryService,
        private _productService: ProductService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router
    ) {
        _activatedRoute.params.subscribe((val) => {
            this.dvId = val['id'];
        });
    }

    ngOnInit(): void {
        this._productService.getODisplayView(this.dvId).subscribe((res) => {
            this.displayView = res.data;
        });
    }
}
