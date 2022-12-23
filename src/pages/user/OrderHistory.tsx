import Button from '../../components/ui/Button';
import { useLoaderData } from 'react-router-dom';
import { Order } from '../../types/altogic';
import moneyFormat from '../../helpers';
import { format } from 'date-fns';

export default function OrderHistory() {
	const orders = useLoaderData() as Order[];
	return (
		<section className="py-6 px-4 space-y-4 sm:p-6 sm:px-0 sm:pt-0 lg:pb-8">
			<div>
				<div>
					<h2 className="text-lg leading-6 font-medium text-gray-900">Order history</h2>
					<p className="mt-1 text-sm text-gray-500">
						Check the status of recent orders, manage returns, and discover similar products.
					</p>
				</div>
			</div>

			{orders?.map(order => (
				<div key={order._id} className="bg-white border-gray-200 shadow-sm rounded-lg border p-4">
					<div className="flex items-center">
						<dl className="flex-1 grid sm:grid-cols-2 gap-2 md:grid-cols-4">
							<div>
								<dt className="font-medium text-gray-900">Order number</dt>
								<dd className="mt-1 text-gray-500 select-all">
									#{order.orderNumber?.toString().padStart(6, '0')}
								</dd>
							</div>
							<div>
								<dt className="font-medium text-gray-900">Order date</dt>
								<dd className="mt-1 text-gray-500">
									<time dateTime={order.createdAt}>{format(new Date(order.createdAt), 'P')}</time>
								</dd>
							</div>
							<div>
								<dt className="font-medium text-gray-900">Order status</dt>
								<dd className="mt-1 font-medium text-gray-500">{order.status}</dd>
							</div>
							<div>
								<dt className="font-medium text-gray-900">Total amount</dt>
								<dd className="mt-1 font-medium text-gray-500">{moneyFormat(order.totalPrice)}</dd>
							</div>
						</dl>
						<div className="flex items-center justify-center">
							<Button variant="primary">View details</Button>
						</div>
					</div>
				</div>
			))}
		</section>
	);
}
