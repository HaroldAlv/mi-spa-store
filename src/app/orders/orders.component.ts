import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, TableModule, CardModule,ButtonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  providers: [DataService],
})
export class OrdersComponent {

  constructor(private route: ActivatedRoute,private dataService: DataService,private router: Router) { }
  protected customer: String = '';
  orders: any[] = [];
  isDataLoaded = false; 

  ngOnInit(): void {
    this.customer = this.route.snapshot.paramMap.get('customer') || '';
    this.getData();
    if (!sessionStorage.getItem('reloaded')) {
      sessionStorage.setItem('reloaded', 'true');
      location.reload();
    } else {
      sessionStorage.removeItem('reloaded'); 
    }
  }

  getData(): void {
    this.dataService.getData(`GetClientOrders/${this.customer}`).subscribe({
      next: (response) => {
        debugger;
        this.orders  = response;
      },
      error: (error) => {
        console.error('Error al obtener los datos:', error);
      }
    }
    );
  }

  closeOrders(): void {
    this.router.navigate(['']);
  }
}
