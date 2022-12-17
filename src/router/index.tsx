import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import useAuthStore from '../store/auth';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ProductDetail from '../pages/ProductDetail';
import Error from '../pages/Error';
import Profile from '../pages/Profile';
import AddProduct from '../pages/admin/AddProduct';
import Panel from '../pages/admin/Panel';
import CategoryService from '../services/CategoryService';
import Default from '../pages/admin/Default';
import ProductService from '../services/ProductService';
import Cart from '../pages/Cart';
import Logout from '../pages/auth/Logout';

export const router = createBrowserRouter([
	{
		path: '/',
		children: [
			{
				async loader() {
					return ProductService.getProducts();
				},
				index: true,
				element: <Home />
			},
			{
				path: '/product/:slug',
				element: <ProductDetail />
			},
			{
				path: '/cart',
				element: (
					<AuthOnly>
						<Cart />
					</AuthOnly>
				)
			},
			{
				path: '/auth/login',
				element: (
					<GuestOnly>
						<Login />
					</GuestOnly>
				)
			},
			{
				path: '/auth/register',
				element: (
					<GuestOnly>
						<Register />
					</GuestOnly>
				)
			},
			{
				path: '/auth/logout',
				element: (
					<AuthOnly>
						<Logout />
					</AuthOnly>
				)
			},
			{
				path: '/profile',
				element: (
					<AuthOnly>
						<Profile />
					</AuthOnly>
				)
			},
			{
				path: '/admin',
				element: (
					<AdminOnly>
						<Default />
					</AdminOnly>
				),
				async loader() {
					return CategoryService.getCategories();
				},
				children: [
					{
						index: true,
						element: <Panel />
					},
					{
						path: 'add-product',
						element: <AddProduct />
					}
				]
			}
		],
		errorElement: <Error />
	}
]);

function AuthOnly({ children }: { children: JSX.Element }) {
	const { user, session } = useAuthStore();

	if (!user || !session) {
		return <Navigate to="/auth/login" />;
	}

	return children;
}

function AdminOnly({ children }: { children: JSX.Element }) {
	const { user, session } = useAuthStore();

	if (!user || !session || !user.isAdmin) {
		return <Navigate to="/profile" />;
	}

	return children;
}

function GuestOnly({ children }: { children: JSX.Element }) {
	const { user, session } = useAuthStore();

	if (user && session) {
		return <Navigate to="/" />;
	}

	return children;
}
