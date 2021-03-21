import { Order, Filter } from './../shared/interfaces';
import { Subscription } from 'rxjs';
import { OrdersService } from './../shared/services/orders.service';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { MaterialInstance } from './../shared/classes/material.service';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';

const STEP = 2

@Component({
  selector: 'app-hystory-page',
  templateUrl: './hystory-page.component.html',
  styleUrls: ['./hystory-page.component.scss']
})
export class HystoryPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tooltip') tooltipRef!: ElementRef
  tooltip!: MaterialInstance
  oSub!: Subscription
  isFilterVisible = false
  orders: Order[] = []
  filter: Filter = {}

  offset = 0
  limit = STEP

  loading = false
  reloading = false
  noMoreOrders = false

  constructor(
    private ordersService: OrdersService
  ) { }

  ngOnInit(): void {
    this.reloading = true
    this.fetch()
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })
    this.oSub = this.ordersService.fetch(params).subscribe(
      orders => {
        this.orders = this.orders.concat(orders)
        this.noMoreOrders = orders.findIndex(order => order.order === 1) === 1
        this.loading = false
        this.reloading = false
      }
    )
  }

  loadMore() {
    this.offset += STEP
    this.loading = true
    this.fetch()
  }

  ngOnDestroy() {
    this.tooltip.destroy!()
    this.oSub?.unsubscribe()
  }

  applyFilter(filter: Filter) {
    this.orders = []
    this.offset = 0
    this.filter = filter
    this.reloading = true
    this.fetch()
  }

  ngAfterViewInit() {
    this.tooltip = MaterialService.initTootip(this.tooltipRef)
  }

  isFiltered(): boolean {
    return !!Object.keys(this.filter).length
  }

}
