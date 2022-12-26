import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import { format } from 'date-fns';
import { useLoaderData } from 'react-router-dom';
import { Order } from '../../types/altogic';
import moneyFormat from '../../helpers';

export default function Orders() {
	const orders = useLoaderData() as Order[];
	const cols = [
		{ colName: 'Order Number' },
		{ colName: 'User' },
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
		user: order.user.name,
		total: moneyFormat(order.totalPrice),
		status: order.status,
		createdAt: format(new Date(order.createdAt), 'P'),
		actions: (
			<div className="flex gap-2">
				<Button variant="secondary" size="small">
					View details
				</Button>
			</div>
		)
	}));
	return (
		<AdminLayout title="Orders">
			<div className="px-4 sm:p-0 space-y-2">
				<Table cols={cols} rows={rows} />
			</div>
		</AdminLayout>
	);
}
