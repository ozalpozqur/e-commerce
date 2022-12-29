import AdminLayout from '../../layouts/AdminLayout';
import Table from '../../components/ui/Table';
import moneyFormat, { cn } from '../../helpers';
import Button from '../../components/ui/Button';
import { FaPlus } from 'react-icons/all';
import { format } from 'date-fns';
import { APIError } from 'altogic';
import { toast } from 'react-toastify';
import { useState } from 'react';
import ProductService from '../../services/ProductService';
import ConfirmModal from '../../components/ConfirmModal';
import CartService from '../../services/CartService';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Product } from '../../types/altogic';

export default function Products() {
	const productsFromDB = useLoaderData() as Product[];
	const [products, setProducts] = useState(productsFromDB);
	const [confirmationIsOpen, setConfirmationIsOpen] = useState(false);
	const [selectedProductId, setSelectedProductId] = useState<string>();
	const [deleting, setDeleting] = useState(false);
	const navigate = useNavigate();

	const cols = [
		{ colName: '', className: 'min-w-[6rem] w-24' },
		{ colName: 'Name' },
		{ colName: 'Variant ID' },
		{ colName: 'Stock' },
		{ colName: 'Category' },
		{ colName: 'Color' },
		{ colName: 'Size' },
		{ colName: 'Price' },
		{ colName: 'Created At' },
		{ colName: 'Actions', className: 'w-32 text-center' }
	];
	const rows = products.map(product => ({
		cover: <img className="object-cover w-16 h-24 rounded" src={product.coverURL} alt={product.name} />,
		name: <p className="w-[20ch] whitespace-normal">{product.name}</p>,
		variantCode: (
			<p className="w-[15ch] overflow-x-auto [&::-webkit-scrollbar]:hidden select-all">{product.variantId}</p>
		),
		stock: (
			<span className={cn('tabular-nums block text-center', product.qtyInStock === 0 && 'text-red-600')}>
				{product.qtyInStock}
			</span>
		),
		category: product.category.name,
		color: product.color?.name,
		size: product.size?.name,
		price: <span className="tabular-nums">{moneyFormat(product.price)}</span>,
		createdAt: format(new Date(product.createdAt), 'P'),
		action: (
			<div className="flex gap-1">
				<Button as="link" href={`/product/${product._id}`} variant="white" size="small">
					View
				</Button>
				<Button onClick={() => addVariant(product._id)} variant="secondary" size="small">
					Add Variant
				</Button>
				<Button as="link" href={`/admin/products/edit/${product._id}`} variant="primary" size="small">
					Edit
				</Button>
				<Button onClick={() => showConfirmation(product._id)} variant="danger" size="small">
					Delete
				</Button>
			</div>
		)
	}));

	async function addVariant(productId: string) {
		try {
			const { variantId } = await ProductService.addVariant(productId);
			navigate('/admin/products/new?variantId=' + variantId);
		} catch (errors) {
			(errors as APIError).items.forEach(item => toast.error(item.message));
		}
	}

	async function deleteProduct() {
		if (!selectedProductId) return;
		try {
			setDeleting(true);
			await ProductService.deleteProduct(selectedProductId);
			setProducts(prev => prev.filter(item => item._id !== selectedProductId));
			toast.success('Product deleted successfully');
			await CartService.removeCartItemByProductId(selectedProductId);
		} catch (errors) {
			(errors as APIError).items.forEach(item => toast.error(item.message));
		} finally {
			setDeleting(false);
			closeConfirmation();
		}
	}
	function showConfirmation(id: string) {
		setSelectedProductId(id);
		setConfirmationIsOpen(true);
	}
	function closeConfirmation() {
		setConfirmationIsOpen(false);
	}

	return (
		<AdminLayout title="All Products">
			<>
				<ConfirmModal
					confirmText="Are you sure you want to delete this?"
					isOpen={confirmationIsOpen}
					close={closeConfirmation}
					loading={deleting}
					onConfirm={deleteProduct}
				/>
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
			</>
		</AdminLayout>
	);
}
