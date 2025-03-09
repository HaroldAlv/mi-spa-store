import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-new-order',
  imports: [CommonModule, CardModule,ButtonModule,
    FormsModule,
    DropdownModule,
    CalendarModule,
    InputTextModule,ReactiveFormsModule,DividerModule  ],
  templateUrl: './new-order.component.html',
  styleUrl: './new-order.component.css'
})
export class NewOrderComponent {
  protected orderForm: FormGroup;
  employees:any[] = [];
  shippers:any[] = [];
  products:any[]= [];
  selectedEmployee: any;
  selectedShipper: any;
  shipName: string = '';
  shipAddress: string = '';
  shipCity: string = '';
  shipCountry: string = '';
  orderDate: Date | null = null;
  requiredDate: Date | null = null;
  shippedDate: Date | null = null;
  freight: string = '';

  constructor(private route: ActivatedRoute,private dataService: DataService,private router: Router, private fb: FormBuilder) 
  {
    debugger;
    this.orderForm = this.fb.group({
      employee: [null, Validators.required],
      shipper: [null, [Validators.required]], 
      shipname: [null, [Validators.required]], 
      shipaddress: [null, [Validators.required]], 
      shipcity: [null, [Validators.required]], 
      shipcountry: [null, [Validators.required]], 
      orderdate: [null, [Validators.required]],
      requireddate: [null, [Validators.required]],
      shippeddate: [null, [Validators.required]],
      freight: [null, [Validators.required, Validators.min(0)]],
      productid: [null, Validators.required],
      unitprice: [null, Validators.required],
      qty: [null, Validators.required],
      discount: [null, Validators.required],
    });  
  }
  protected customer: String = '';
  protected custid: any;

  ngOnInit(): void {
    debugger;
    this.customer = this.route.snapshot.paramMap.get('customer') || '';
    this.getData();
    this.getEmployees();
    this.getShippers();
    this.getProducts();
    if (!sessionStorage.getItem('reloaded1')) {
      sessionStorage.setItem('reloaded1', 'true');
      location.reload();
    } else {
      sessionStorage.removeItem('reloaded1'); 
    }
  }

  getData(): void {
    this.dataService.getData(`GetClientOrders/${this.customer}`).subscribe({
      next: (response) => {
        debugger;
        this.custid = response[0].custid;
      },
      error: (error) => {
        console.error('Error al obtener los datos:', error);
      }
    }
    );
  }

  getEmployees(): void {
    this.dataService.getData(`GetEmployees`).subscribe({
      next: (response) => {
        debugger;
        this.employees = response.map((employee: any) => ({
          label: employee.FullName, 
          value: employee.empid, 
        }));
      },
      error: (error) => {
        console.error('Error al obtener los datos:', error);
      }
    }
    );
  }


  getShippers(): void {
    this.dataService.getData(`GetShippers`).subscribe({
      next: (response) => {
        debugger;
        this.shippers = response.map((shipper: any) => ({
          label: shipper.companyname, 
          value: shipper.shipperid, 
        }));
      },
      error: (error) => {
        console.error('Error al obtener los datos:', error);
      }
    }
    );
  }

  getProducts(): void {
    this.dataService.getData(`GetProducts`).subscribe({
      next: (response) => {
        debugger;
        this.products = response.map((products: any) => ({
          label: products.productname, 
          value: products.productid, 
        }));
      },
      error: (error) => {
        debugger;
        console.error('Error al obtener los datos:', error);
      }
    }
    );
  }

  closeOrder(): void {
    this.router.navigate(['']);
  }

  submitForm() {
    debugger
    if (this.orderForm.valid) {
      console.log('Formulario válido', this.orderForm.value);
      const orderData: Order = this.prepareOrderData(this.orderForm.value);
      console.log('Enviando:', JSON.stringify(orderData, null, 2));
      this.dataService.postData("AddNewOrder", orderData).subscribe({
        next: (response) => {
          debugger;
          alert("Se creo la Orden Exitosamente.");
          location.reload();
        },
        error: (error) => {
          debugger;
          alert("Ocurrió un error al crear la orden.");
        }
      })
    } else {
      alert("Todos los campos son obligatorios.");
      console.log('Formulario inválido');
    }
  }

  prepareOrderData(formValue: any): Order {
      return {
        EmpID: formValue.employee,
        CustID: this.custid,
        ShipperID: formValue.shipper,
        ShipName: formValue.shipname,
        ShipAddress: formValue.shipaddress,
        ShipCity: formValue.shipcity,
        OrderDate: formValue.orderdate,
        RequiredDate: formValue.requireddate,
        ShippedDate: formValue.shippeddate,
        Freight: formValue.freight,
        ShipCountry: formValue.shipcountry,
        ProductID: formValue.productid,
        UnitPrice: formValue.unitprice,
        Qty: formValue.qty,
        Discount: formValue.discount,
      };
    }
  

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}${month}${day}`;
  }
}

export interface Order {
  EmpID: number;
  CustID: number;
  ShipperID: number;
  ShipName: string;
  ShipAddress: string;
  ShipCity: string;
  OrderDate: string; 
  RequiredDate: string;
  ShippedDate: string; 
  Freight: number;
  ShipCountry: string;
  ProductID: number;
  UnitPrice: number;
  Qty: number;
  Discount: number;
}