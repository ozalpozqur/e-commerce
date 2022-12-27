import AdminLayout from '../../layouts/AdminLayout';
import useCategoryStore from '../../store/category';
import { useFormik } from 'formik';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import SelectBox from '../../components/ui/SelectBox';
import * as Yup from 'yup';
import ProductService from '../../services/ProductService';
import { toast } from 'react-toastify';
import useProductStore from '../../store/product';
import { ChangeEvent, useState } from 'react';
import DropZone from '../../components/ui/DropZone';
import { MdDelete } from 'react-icons/all';
import { isMobile } from 'react-device-detect';
import { cn } from '../../helpers';
import Button from '../../components/ui/Button';
import { APIError } from 'altogic';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Product } from '../../types/altogic';
import CartService from '../../services/CartService';
import useCartStore from '../../store/cart';

const addProductSchema = Yup.object().shape({
	name: Yup.string().required('This field is required'),
	qtyInStock: Yup.number().min(0, 'Stock quantity must be greater than 0').required('This field is required'),
	category: Yup.string().required('This field is required'),
	description: Yup.string().required('This field is required'),
	price: Yup.number().min(0, 'Product price cannot be negative value').required('This field is required'),
	image: Yup.mixed().required('Product cover is required')
});

interface AddOrUpdateProductProps {
	type?: 'add' | 'update';
}
export default function AddOrUpdateProduct({ type = 'add' }: AddOrUpdateProductProps) {
	const isEditMode = type === 'update';
	const product = useLoaderData() as Product;
	const { categories } = useCategoryStore();
	const { addProduct, updateProduct } = useProductStore();
	const { setCart } = useCartStore();
	const [imagePreview, setImagePreview] = useState<string | null>(isEditMode ? product.coverURL : null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const formik = useFormik({
		initialValues: {
			name: isEditMode ? product.name : '',
			qtyInStock: isEditMode ? product.qtyInStock : '',
			category: isEditMode ? product.category : '',
			description: isEditMode ? product.description : '',
			price: isEditMode ? product.price : '',
			image: isEditMode ? product.coverURL : null
		},
		validationSchema: addProductSchema,
		onSubmit: async ({ image, ...rest }) => {
			setLoading(true);
			try {
				// @ts-ignore
				await (isEditMode ? updateProductInfo : addNewProduct)(image, rest);
			} catch (errors) {
				console.error(errors);
				(errors as APIError).items.forEach((item: any) => toast.error(item.message));
			} finally {
				setLoading(false);
			}
		}
	});

	async function updateProductInfo(image: string | File, data: object) {
		let coverURL = image;
		if (image instanceof File) {
			// @ts-ignore
			const { data: dataFromUploader, errors } = await ProductService.uploadCoverImage(image);
			if (errors) return toast.error("Product cover couldn't updated, please try again");
			coverURL = dataFromUploader.publicPath;
		}
		// @ts-ignore
		const updatedProduct = await ProductService.updateProfile(product._id, { ...data, coverURL });
		toast.success('Product updated successfully');
		updateProduct(updatedProduct);
		setCart(await CartService.getCart());
	}

	async function addNewProduct(image: string, data: object) {
		// @ts-ignore
		const product = await ProductService.addProduct(data, image);
		addProduct(product);
		navigate('/admin/products');
		toast.success('Product added successfully');

		formik.resetForm();
		setImagePreview(null);
	}

	function removeCoverImage() {
		setImagePreview(null);
		formik.setFieldValue('image', null);
	}
	function onSelectImage(files: File[]) {
		const [file] = files;
		setImagePreview(URL.createObjectURL(file));
		formik.setFieldValue('image', file);
	}

	function resetForm() {
		formik.resetForm();
		setImagePreview(null);
	}

	function onSelectedImageInMobile(e: ChangeEvent<HTMLInputElement>) {
		if (!e.target.files) return;
		const [file] = e.target.files;
		setImagePreview(URL.createObjectURL(file));
		formik.setFieldValue('image', file);
	}

	return (
		<AdminLayout title={isEditMode ? 'Update Product' : 'Add Product'}>
			<form className="space-y-8 divide-y divide-gray-200 px-4 md:px-0" onSubmit={formik.handleSubmit}>
				<div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
					<div>
						<div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
							<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
								<p className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">Product name</p>
								<Input
									showError={!!formik.errors.name && !!formik.touched.name}
									errorMessage={formik.errors.name}
									onChange={formik.handleChange}
									value={formik.values.name}
									name="name"
								/>
							</div>
							<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5 sm:border-t sm:border-gray-200">
								<p className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
									Product in stock
								</p>
								<Input
									showError={!!formik.errors.qtyInStock && !!formik.touched.qtyInStock}
									errorMessage={formik.errors.qtyInStock}
									onChange={formik.handleChange}
									value={formik.values.qtyInStock}
									name="qtyInStock"
									type="number"
								/>
							</div>
							<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5 sm:border-t sm:border-gray-200">
								<p className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
									Product price
								</p>
								<Input
									showError={!!formik.errors.price && !!formik.touched.price}
									errorMessage={formik.errors.price}
									onChange={formik.handleChange}
									value={formik.values.price}
									name="price"
									type="number"
								/>
							</div>
							<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5 sm:border-t sm:border-gray-200">
								<p className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
									Product category
								</p>
								<SelectBox
									showError={!!formik.errors.category && !!formik.touched.category}
									errorMessage={formik.errors.category}
									onChange={formik.handleChange}
									value={formik.values.category.toString()}
									name="category"
									className="w-full"
									fields={categories.map(category => ({ id: category._id, value: category.name }))}
								/>
							</div>
							<Textarea
								showError={!!formik.errors.description && !!formik.touched.description}
								errorMessage={formik.errors.description}
								onChange={formik.handleChange}
								value={formik.values.description}
								name="description"
								rows={6}
								label="Product description"
								className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5"
							/>
							<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
								<p className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
									Product cover
								</p>

								{imagePreview ? (
									<div className="grid mt-1 grid-cols-2 sm:flex flex gap-2 sm:col-span-2">
										<picture className="group border-gray-300 w-full sm:w-fit sm:min-w-[150px] flex items-center justify-center relative h-40 border p-1 rounded-md">
											<img
												draggable={false}
												className="max-h-full w-full rounded object-cover"
												src={imagePreview}
												alt="selected cover image"
											/>
										</picture>
										<button
											onClick={removeCoverImage}
											className="bg-white gap-2 whitespace-nowrap px-4 py-2 self-end rounded bg-indigo-600 flex items-center justify-center text-white right-0.5"
										>
											<MdDelete size={20} />
											Remove Cover
										</button>
									</div>
								) : isMobile ? (
									<div>
										<label
											className={cn(
												'block border px-3 py-2 text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm border-gray-300 rounded-md',
												formik.errors.image && formik.touched.image ? 'border-red-600' : ''
											)}
										>
											<input
												onChange={onSelectedImageInMobile}
												type="file"
												name="image"
												className="hidden"
												accept="image/*"
											/>
											Select cover photo
										</label>
										{formik.errors.image && formik.touched.image ? (
											<small className="text-red-600">{formik.errors.image}</small>
										) : undefined}
									</div>
								) : (
									<DropZone
										multiple={false}
										showError={!!formik.errors.image && !!formik.touched.image}
										errorMessage={formik.errors.image}
										accept="image/*"
										name="image"
										onSelected={onSelectImage}
										className="sm:mt-0 sm:col-span-2 block mt-1"
									/>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="pt-5">
					<div className="flex justify-end gap-2">
						{isEditMode ? (
							<Button as="link" href="/admin/products" variant="secondary">
								Go back
							</Button>
						) : (
							<Button type="button" onClick={resetForm} variant="secondary">
								Clear
							</Button>
						)}
						<Button loading={loading} type="submit">
							{isEditMode ? 'Update product' : 'Add product'}
						</Button>
					</div>
				</div>
			</form>
		</AdminLayout>
	);
}
