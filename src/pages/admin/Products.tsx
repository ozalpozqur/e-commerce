import AdminLayout from '../../layouts/AdminLayout';
import useProductStore from '../../store/product';
import Table from '../../components/ui/Table';
import moneyFormat from '../../helpers';
import Button from '../../components/ui/Button';
import { FaPlus } from 'react-icons/all';
import { format } from 'date-fns';

export default function Products() {
	const { products } = useProductStore();
	const cols = [
		{ colName: '', className: 'min-w-[6rem] w-24' },
		{ colName: 'Name' },
		{ colName: 'Stock' },
		{ colName: 'Price' },
		{ colName: 'Created At' },
		{ colName: 'Actions', className: 'w-32' }
	];
	const rows = products.map(product => ({
		cover: <img className="object-cover w-16 h-24 rounded" src={product.coverURL} alt={product.name} />,
		name: product.name,
		stock: product.qtyInStock,
		price: moneyFormat(product.price),
		createdAt: format(new Date(product.createdAt), 'P'),
		action: (
			<div className="flex gap-2">
				<Button as="link" href={`/product/${product._id}`} variant="secondary" size="small">
					View
				</Button>
				<Button as="link" href={`/product/${product._id}`} variant="primary" size="small">
					Edit
				</Button>
			</div>
		)
	}));
	return (
		<AdminLayout title="All Products">
			<div className="space-y-2 px-4 sm:p-0">
				<div className="flex justify-end">
					<Button
						as="link"
						href="/admin/products/new"
						className="flex gap-1"
						size="small"
						variant="secondary"
					>
						<FaPlus size={10} />
						Add new product
					</Button>
				</div>
				<Table cols={cols} rows={rows} />
			</div>
		</AdminLayout>
	);
}
