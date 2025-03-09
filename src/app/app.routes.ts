import { Routes } from '@angular/router';
import { SalesPredictionComponent } from './sales-prediction/sales-prediction.component';
import { NewOrderComponent } from './new-order/new-order.component';
import { OrdersComponent } from './orders/orders.component';

export const routes: Routes = [
  { path: '', component: SalesPredictionComponent }, // Ruta por defecto
  { path: 'orders/:customer', component: OrdersComponent },
  { path: 'new-order/:customer', component: NewOrderComponent },
  { path: '**', redirectTo: '' } 
];