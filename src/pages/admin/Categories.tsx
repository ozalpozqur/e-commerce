import AdminLayout from '../../layouts/AdminLayout';
import useCategoryStore from '../../store/category';
import Button from '../../components/ui/Button';
import { FaPlus } from 'react-icons/all';
import Table from '../../components/ui/Table';
import { format } from 'date-fns';
import { useState } from 'react';
import ConfirmModal from '../../components/ConfirmModal';
import CategoryService from '../../services/CategoryService';
import { toast } from 'react-toastify';
import { APIError } from 'altogic';
import { useLoaderData } from 'react-router-dom';
import { Category } from '../../types/altogic';

export default function Categories() {
	const [confirmationIsOpen, setConfirmationIsOpen] = useState(false);
	const [selectedCategoryId, setSelectedCategoryId] = useState<string>();
	const [deleting, setDeleting] = useState(false);
	const categoriesFromDB = useLoaderData() as Category[];
	const [categories, setCategories] = useState<Category[]>(categoriesFromDB);

	const cols = [
		{ colName: 'Name' },
		{ colName: 'Created At', className: 'w-52' },
		{ colName: 'Actions', className: 'w-32' }
	];
	const rows = categories.map(category => ({
		name: category.name,
		createdAt: format(new Date(category.createdAt), 'P'),
		action: (
			<div className="flex gap-2">
				<Button as="link" href={`/category/${category.slug}`} variant="secondary" size="small">
					View
				</Button>
				<Button onClick={() => showConfirmation(category._id)} variant="danger" size="small">
					Delete
				</Button>
			</div>
		)
	}));
	async function deleteCategory() {
		if (!selectedCategoryId) return;
		try {
			setDeleting(true);
			await CategoryService.deleteCategory(selectedCategoryId);
			setCategories(prevState => {
				return prevState.filter(category => category._id !== selectedCategoryId);
			});
		} catch (errors) {
			(errors as APIError).items.forEach(item => toast.error(item.message));
		} finally {
			setDeleting(false);
			closeConfirmation();
		}
	}
	function showConfirmation(id: string) {
		setSelectedCategoryId(id);
		setConfirmationIsOpen(true);
	}
	function closeConfirmation() {
		setConfirmationIsOpen(false);
	}

	return (
		<AdminLayout title="All Categories">
			<>
				<ConfirmModal
					confirmText="Are you sure you want to delete this?"
					isOpen={confirmationIsOpen}
					close={closeConfirmation}
					loading={deleting}
					onConfirm={deleteCategory}
				/>
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
			</>
		</AdminLayout>
	);
}
