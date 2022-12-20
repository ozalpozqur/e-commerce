import AdminLayout from '../../layouts/AdminLayout';
import useCategoryStore from '../../store/category';
import Button from '../../components/ui/Button';
import { FaPlus } from 'react-icons/all';
import Table from '../../components/ui/Table';
import { format } from 'date-fns';

export default function Categories() {
	const { categories } = useCategoryStore();
	const cols = [
		{ colName: 'Name' },
		{ colName: 'Created At', className: 'w-52' },
		{ colName: 'Actions', className: 'w-32' }
	];
	const rows = categories.map(category => ({
		name: category.name,
		createdAt: format(new Date(category.createdAt), 'PPP'),
		action: (
			<div className="flex gap-2">
				<Button as="link" href={`/category/${category.slug}`} variant="secondary" size="small">
					View
				</Button>
				<Button as="link" href={`/category/${category.slug}`} variant="primary" size="small">
					Edit
				</Button>
				<Button variant="danger" size="small">
					Delete
				</Button>
			</div>
		)
	}));

	return (
		<AdminLayout title="All Categories">
			<div className="px-4 sm:p-0 space-y-2">
				<div className="flex justify-end">
					<Button
						as="link"
						href="/admin/categories/new"
						size="small"
						variant="secondary"
						className="flex gap-1"
					>
						<FaPlus size={10} />
						Add new category
					</Button>
				</div>
				<Table cols={cols} rows={rows} />
			</div>
		</AdminLayout>
	);
}
