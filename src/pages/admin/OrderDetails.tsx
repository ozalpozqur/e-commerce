import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import { useLoaderData, useParams } from 'react-router-dom';
import { OrderItem, OrderStatus } from '../../types/altogic';
import moneyFormat from '../../helpers';
import SelectBox from '../../components/ui/SelectBox';
import { useState } from 'react';
import { OrderService } from '../../services';
import { toast } from 'react-toastify';
import { APIError } from 'altogic';

const status: OrderStatus[] = ['waiting', 'preparing', 'shipped', 'completed', 'canceled'];

export default function OrderDetails() {
	const orderDetails = useLoaderData() as OrderItem[];
	const [currentStatus, setCurrentStatus] = useState<OrderStatus>(orderDetails[0].order.status);
	const [updating, setUpdating] = useState(false);
	const { orderId } = useParams();

	const cols = [
		{ colName: '', className: 'min-w-[6rem] w-24' },
		{ colName: 'Product Name' },
		{ colName: 'Quantity' },
		{ colName: 'Price' },
		{
			colName: 'Actions',
			className: 'w-24'
		}
	];
	const rows = orderDetails.map(item => ({
		cover: <img className="object-cover w-16 h-24 rounded" src={item.product.coverURL} alt={item.product.name} />,
		productName: item.productName,
		quantity: item.quantity,
		price: moneyFormat(item.price),
		actions: (
			<div className="flex gap-2">
				<Button as="link" href={`/product/${item.product._id}`} variant="secondary" size="small">
					View product
				</Button>
			</div>
		)
	}));

	async function updateStatusHandler() {
		if (!orderId) return;
		try {
			setUpdating(true);
			await OrderService.updateOrder(orderId, { status: currentStatus });
			toast.success('Order status updated');
		} catch (e) {
			(e as APIError).items.forEach(item => toast.error(item.message));
		} finally {
			setUpdating(false);
		}
	}

	return (
		<AdminLayout title="Order Details">
			<div className="px-4 sm:p-0 space-y-2">
				<div className="flex items-end justify-end gap-2">
					<SelectBox
						firstSelectionText="Select a status"
						onChange={e => setCurrentStatus(e.target.value as OrderStatus)}
						value={currentStatus}
						name="status"
						fields={status.map(value => ({ id: value, value: value.toLocaleUpperCase() }))}
					/>
					<Button loading={updating} className="py-1.5" onClick={updateStatusHandler}>
						Save Status
					</Button>
				</div>
				<Table cols={cols} rows={rows} />
			</div>
		</AdminLayout>
	);
}
