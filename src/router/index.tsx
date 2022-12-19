import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import useAuthStore from '../store/auth';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ProductDetail from '../pages/ProductDetail';
import Error from '../pages/Error';
import Profile from '../pages/user/Profile';
import AddProduct from '../pages/admin/AddProduct';
import Panel from '../pages/admin/Panel';
import CategoryService from '../services/CategoryService';
import Default from '../pages/admin/Default';
import ProductService from '../services/ProductService';
import Cart from '../pages/Cart';
import Logout from '../pages/auth/Logout';
import ChangeUserInfo from '../pages/user/ChangeUserInfo';
import UserAddress from '../pages/user/UserAddress';
import ShopLayout from '../layouts/ShopLayout';
import Checkout from '../pages/Checkout';

export const router = createBrowserRouter([
	{
		path: '/',
		children: [
			{
				async loader() {
					return ProductService.getProducts();
				},
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
				path: '/checkout',
				element: (
					<AuthOnly>
						<ShopLayout>
							<Checkout />
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
					}
				]
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
