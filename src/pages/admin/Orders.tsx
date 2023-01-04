import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import { format } from 'date-fns';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import { Order, OrderStatus, PaginateData } from '../../types/altogic';
import { moneyFormat } from '../../helpers';
import Pagination from '../../components/Pagination';
import { useState } from 'react';
import { OrderService } from '../../services';
import Dropdown from '../../components/ui/Dropdown';
import { toast } from 'react-toastify';
import { APIError } from 'altogic';
import altogic from '../../libs/altogic';
import { tr } from 'date-fns/locale';
const status: OrderStatus[] = ['waiting', 'preparing', 'shipped', 'completed', 'canceled'];

interface OrderLoader {
	orders: Order[];
	paginateData: PaginateData;
}
export default function Orders() {
	const { orders: orderFromDB, paginateData: paginateDataFromDB } = useLoaderData() as OrderLoader;
	const [orders, setOrders] = useState(orderFromDB);
	const [paginateData, setPaginateData] = useState(paginateDataFromDB);
	const [searchParams] = useSearchParams();

	function items(orderId: string) {
		return status.map(item => ({
			title: `Set to ${item}`,
			onClick: () => updateStatus(orderId, item)
		}));
	}
	async function updateStatus(orderId: string, status: OrderStatus) {
		toast.dismiss();
		const loading = toast.loading('Order updating...', {
			closeOnClick: true,
			isLoading: false,
			closeButton: true,
			autoClose: 2000
		});
		try {
			const order = await OrderService.updateOrder(orderId, { status });
			setOrders(prev =>
				prev.map(item => {
					if (item._id === order._id) item.status = order.status;
					return item;
				})
			);
			if (status === 'waiting') {
				altogic.realtime.send('admin', 'waiting-order-count', false);
			}
			toast.update(loading, {
				render: 'Order status updated',
				type: 'success'
			});
		} catch (e) {
			toast.dismiss(loading);
			(e as APIError).items.forEach(item => toast.error(item.message));
		}
	}

	const cols = [
		{ colName: 'Order Number' },
		{ colName: 'Customer' },
		{ colName: 'Total Price' },
		{ colName: 'Status' },
		{ colName: 'Created At', className: 'w-52' },
		{
			colName: 'Actions',
			className: 'w-24 text-center'
		}
	];
	const rows = orders.map(order => ({
		orderNumber: '#' + order.orderNumber.toString().padStart(6, '0'),
		customer: order.user?.name || '-',
		total: moneyFormat(order.totalPrice),
		status: order.status.toUpperCase(),
		createdAt: format(new Date(order.createdAt), 'P p'),
		actions: (
			<div className="flex gap-2">
				<Button variant="white" size="small">
					Set tracking code
				</Button>
				<Dropdown buttonVariant="primary" buttonSize="small" items={items(order._id)}>
					Change status
				</Dropdown>
				<Button
					as="link"
					href={`/admin/orders/${order._id}?orderNumber=${order.orderNumber}`}
					variant="secondary"
					size="small"
				>
					View details
				</Button>
			</div>
		)
	}));

	async function getPaginateProducts() {
		const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
		const { orders, paginateData } = await OrderService.getAllOrders(page);
		setOrders(orders);
		setPaginateData(paginateData);
	}

	return (
		<AdminLayout title="Orders">
			<div className="px-4 sm:p-0 space-y-2">
				<Table cols={cols} rows={rows} />
				<Pagination onPageChange={getPaginateProducts} paginateData={paginateData} />
			</div>
		</AdminLayout>
	);
}
