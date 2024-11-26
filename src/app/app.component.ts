import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crudapp';
  // Form State
  productForm = { pName: '', desc: '', price: '', id: '' };
  isEditing = false;

  // Product List
  products: Array<any> = [];

  private baseUrl = 'https://hussian-7fa93-default-rtdb.europe-west1.firebasedatabase.app//products';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchProducts();
  }

  // Fetch Products
  fetchProducts() {
    this.http.get(`${this.baseUrl}.json`).subscribe((data: any) => {
      this.products = Object.keys(data || {}).map((key) => ({
        id: key,
        ...data[key],
      }));
    });
  }

  // Add or Update Product
  onSubmit(product: { pName: string; desc: string; price: string }) {
    if (this.isEditing) {
      // Update Product
      this.http.put(`${this.baseUrl}/${this.productForm.id}.json`, product).subscribe(() => {
        this.fetchProducts();
        this.resetForm();
      });
    } else {
      // Add Product
      this.http.post(`${this.baseUrl}.json`, product).subscribe(() => {
        this.fetchProducts();
        this.resetForm();
      });
    }
  }

  // Edit Product
  onEdit(product: any) {
    this.productForm = { ...product };
    this.isEditing = true;
  }

  // Delete Product
  onDelete(productId: string) {
    this.http.delete(`${this.baseUrl}/${productId}.json`).subscribe(() => {
      this.fetchProducts();
    });
  }

  // Reset Form
  resetForm() {
    this.productForm = { pName: '', desc: '', price: '', id: '' };
    this.isEditing = false;
  }
}
