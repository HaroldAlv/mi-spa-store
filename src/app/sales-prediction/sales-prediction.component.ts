import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sales-prediction',
  imports: [CommonModule, TableModule, CardModule, ButtonModule,FormsModule,RouterModule],
  standalone: true,
  templateUrl: './sales-prediction.component.html',
  styleUrl: './sales-prediction.component.css',
  providers: [DataService],
})
export class SalesPredictionComponent {
  originalData: any[] = [];
  constructor(private dataService: DataService,private router: Router) { }
  filteredData: any[] = []; 
  filterValue: string = '';
  customers = [
    {
      CustomerName: 'Cliente 1',
      LastOrderDate: '2023-10-01',
      NextPredictedOrder: '2023-11-01'
    },
    {
      CustomerName: 'Cliente 2',
      LastOrderDate: '2023-09-15',
      NextPredictedOrder: '2023-10-15'
    },
    {
      CustomerName: 'Cliente 3',
      LastOrderDate: '2023-08-20',
      NextPredictedOrder: '2023-09-20'
    }
  ];

  ngOnInit(): void {
    this.getData();
    if (!sessionStorage.getItem('reloaded2')) {
      sessionStorage.setItem('reloaded2', 'true');
      location.reload();
    } else {
      sessionStorage.removeItem('reloaded2'); // Limpia para futuras navegaciones
    }
  }

  getData(): void {
    this.dataService.getData("vw_NextPredictedOrder").subscribe({
      next: (response) => {
        this.originalData  = response.map((item: any) => ({
          CustomerName: item.CustomerName, 
          LastOrderDate: item.LastOrderDate,
          NextPredictedOrder: item.NextPredictedOrder
        }));
        this.filteredData = [...this.originalData];
      },
      error: (error) => {
        console.error('Error al obtener los datos:', error);
      }
    }
    );
  }

  viewDetails(customer: any) {
    debugger;
    this.router.navigate(['/orders', customer.CustomerName]);
  }

  predictNextOrder(customer: any) {
    this.router.navigate(['/new-order', customer.CustomerName]);
  }

  filterCustomers() {
    const filterText = this.filterValue.toLowerCase().trim();
  
    if (!filterText) {
      this.filteredData = [...this.originalData]; // Restaurar si el input está vacío
    } else {
      this.filteredData = this.originalData.filter(customer => 
        customer.CustomerName.toLowerCase().includes(filterText)
      );
    }
  }
}
