import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import { useLoaderData } from 'react-router-dom';
import { OrderItem } from '../../types/altogic';
import moneyFormat from '../../helpers';

export default function OrderDetails() {
	const orderDetails = useLoaderData() as OrderItem[];
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
	return (
		<AdminLayout title="Order Details">
			<div className="px-4 sm:p-0 space-y-2">
				<Table cols={cols} rows={rows} />
			</div>
		</AdminLayout>
	);
}
