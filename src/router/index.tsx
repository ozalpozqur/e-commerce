import { createBrowserRouter, Navigate } from 'react-router-dom';
import { rootLoader } from '../loaders';
import { Profile, OrderDetails, OrderHistory, ChangeUserInfo, UserAddress } from '../pages/user';
import { Login, Logout, Register } from '../pages/auth';
import { InitialApp, Error, Category, Cart, Home, ProductDetail } from '../pages';
import { Success } from '../pages/checkout';
import { OrderService, ProductService } from '../services';
import { ShopLayout } from '../layouts';
import Admin, {
	Stats,
	AddCategory,
	AddOrUpdateProduct,
	Products,
	Orders,
	Categories,
	OrderDetails as OrderDetailsAdmin
} from '../pages/admin';
import { useAuthStore } from '../store';

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
					},
					{
						path: 'orders/:orderId',
						async loader({ params: { orderId } }) {
							if (!orderId) return;
							const orderDetails = await OrderService.getOrderDetails(orderId);
							if (orderDetails.length === 0) throw new Response('Not Found', { status: 404 });
							return orderDetails;
						},
						element: <OrderDetails />
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
						element: <AddOrUpdateProduct type="add" />
					},
					{
						path: 'products/edit/:id',
						element: <AddOrUpdateProduct type="update" />,
						async loader({ params: { id } }) {
							if (!id) return;
							const product = await ProductService.getProductById(id);
							if (!product) throw new Response('Not Found', { status: 404 });
							return product;
						}
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
						element: <Products />,
						loader: () => ProductService.getProducts({ onlyHasStock: false })
					},
					{
						path: 'orders',
						element: <Orders />,
						loader: () => OrderService.getAllOrders()
					},
					{
						path: 'orders/:orderId',
						element: <OrderDetailsAdmin />,
						async loader({ params: { orderId } }) {
							if (!orderId) return;
							const orderDetails = await OrderService.getOrderDetails(orderId);
							if (orderDetails.length === 0) throw new Response('Not Found', { status: 404 });
							return orderDetails;
						}
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
