import { Subscription } from 'rxjs';
import { OrdersService } from './../shared/services/orders.service';
import { Order, OrderPosition } from './../shared/interfaces';
import { OrderService } from './order.service';
import { MaterialInstance } from './../shared/classes/material.service';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modalRef!: ElementRef
  isRoot!: boolean
  modal!: MaterialInstance
  loading = false
  oSub?: Subscription

  constructor(
    private router: Router,
    public orderService: OrderService,
    private ordersService: OrdersService
  ) { }

  ngOnInit(): void {
    this.isRoot = this.router.url === '/order'
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order'
      }
    })
  }

  ngOnDestroy() {
    this.modal.destroy!()
    this.oSub?.unsubscribe()
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  open() {
    this.modal.open!()
  }

  close() {
    this.modal.close!()
  }

  submit() {
    this.loading = true
    const order: Order = {
      list: this.orderService.list.map(item => {
        delete item._id
        return item
      })
    }
    this.oSub = this.ordersService.create(order).subscribe(
      newOrder => {
        MaterialService.toast(`Заказ №${newOrder.order} был добавлен`)
        this.orderService.clear()
      },
      error => {
        MaterialService.toast(error.error.message)
      },
      () => {
        this.modal.close!()
        this.loading = false
      }
    )
  }

  removePosition(orderPosition: OrderPosition) {
    this.orderService.remove(orderPosition)
  }
}
