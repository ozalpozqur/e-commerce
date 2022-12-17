import type { User as AltogicUser } from 'altogic';

export interface User extends AltogicUser {
	isAdmin: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Category {
	_id: string;
	name: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
}
export interface Product {
	_id: string;
	name: string;
	price: number;
	description: string;
	category: Category;
	coverURL: string;
	qtyInStock: number;
	createdAt: string;
	updatedAt: string;
}

export interface Order {
	_id: string;
	completed: boolean;
	user: User;
	product: Product;
	createdAt: string;
	updatedAt: string;
}

export interface Cart {
	_id: string;
	user: User;
	product: Product;
	quantity: number;
	createdAt: string;
	updatedAt: string;
}
