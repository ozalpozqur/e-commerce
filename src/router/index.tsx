import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import useAuthStore from '../store/auth';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ProductDetail from '../pages/ProductDetail';
import Error from '../pages/Error';
import Profile from '../pages/user/Profile';
import AddProduct from '../pages/admin/AddProduct';
import Stats from '../pages/admin/Stats';
import Admin from '../pages/admin';
import ProductService from '../services/ProductService';
import Cart from '../pages/Cart';
import Logout from '../pages/auth/Logout';
import ChangeUserInfo from '../pages/user/ChangeUserInfo';
import UserAddress from '../pages/user/UserAddress';
import ShopLayout from '../layouts/ShopLayout';
import AddCategory from '../pages/admin/AddCategory';
import InitialApp from '../pages/InitialApp';
import Category from '../pages/Category';
import Categories from '../pages/admin/Categories';
import Products from '../pages/admin/Products';
import { rootLoader } from '../loaders';
import OrderHistory from '../pages/user/OrderHistory';
import OrderService from '../services/OrderService';
import Success from '../pages/checkout/Success';
import Cancel from '../pages/checkout/Cancel';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <InitialApp />,
		loader: rootLoader,
		children: [
			{
				index: true,
				element: (
					<ShopLayout>
						<Home />
					</ShopLayout>
				)
			},
			{
				path: '/product/:id',
				element: (
					<ShopLayout>
						<ProductDetail />
					</ShopLayout>
				),
				async loader({ params: { id } }) {
					if (!id) return;
					const product = await ProductService.getProductById(id);
					if (!product) throw new Response('Not Found', { status: 404 });
					return product;
				}
			},
			{
				path: '/category/:slug',
				element: (
					<ShopLayout>
						<Category />
					</ShopLayout>
				),
				async loader({ params: { slug } }) {
					if (!slug) return;
					return await ProductService.getProductsByCategory(slug);
				}
			},
			{
				path: '/cart',
				element: (
					<AuthOnly>
						<ShopLayout>
							<Cart />
						</ShopLayout>
					</AuthOnly>
				)
			},
			{
				path: '/checkout/success',
				element: (
					<AuthOnly>
						<ShopLayout>
							<Success />
						</ShopLayout>
					</AuthOnly>
				)
			},
			{
				path: '/checkout/cancel',
				element: (
					<AuthOnly>
						<ShopLayout>
							<Cancel />
						</ShopLayout>
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
						<ShopLayout>
							<Profile />
						</ShopLayout>
					</AuthOnly>
				),
				children: [
					{
						index: true,
						element: <ChangeUserInfo />
					},
					{
						path: 'address',
						element: <UserAddress />
					},
					{
						path: 'orders',
						loader: () => OrderService.getOrders(),
						element: <OrderHistory />
					}
				]
			},
			{
				path: '/admin',
				element: (
					<AdminOnly>
						<Admin />
					</AdminOnly>
				),
				children: [
					{
						index: true,
						element: <Stats />
					},
					{
						path: 'products/new',
						element: <AddProduct />
					},
					{
						path: 'categories',
						element: <Categories />
					},
					{
						path: 'categories/new',
						element: <AddCategory />
					},
					{
						path: 'products',
						element: <Products />
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
