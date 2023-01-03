import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import { format } from 'date-fns';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import { Order, PaginateData } from '../../types/altogic';
import { moneyFormat } from '../../helpers';
import Pagination from '../../components/Pagination';
import { useState } from 'react';
import { OrderService } from '../../services';

interface OrderLoader {
	orders: Order[];
	paginateData: PaginateData;
}
export default function Orders() {
	const { orders: orderFromDB, paginateData: paginateDataFromDB } = useLoaderData() as OrderLoader;
	const [orders, setOrders] = useState(orderFromDB);
	const [paginateData, setPaginateData] = useState(paginateDataFromDB);
	const [searchParams] = useSearchParams();

	const cols = [
		{ colName: 'Order Number' },
		{ colName: 'Customer' },
		{ colName: 'Total Price' },
		{ colName: 'Status' },
		{ colName: 'Created At', className: 'w-52' },
		{
			colName: 'Actions',
			className: 'w-24'
		}
	];
	const rows = orders.map(order => ({
		orderNumber: '#' + order.orderNumber.toString().padStart(6, '0'),
		customer: order.user.name,
		total: moneyFormat(order.totalPrice),
		status: order.status.toUpperCase(),
		createdAt: format(new Date(order.createdAt), 'P p'),
		actions: (
			<div className="flex gap-2">
				<Button as="link" href={`/admin/orders/${order._id}`} variant="secondary" size="small">
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
