import AdminLayout from '../../layouts/AdminLayout';
import { useEffect, useState } from 'react';
import altogic from '../../libs/altogic';
import { OrderStatus } from '../../types/altogic';
import { capitalize } from '../../helpers';
import { BiStats } from 'react-icons/all';

type Stats = {
	[key in OrderStatus]?: number;
};

export default function Stats() {
	const [stats, setStats] = useState<Stats>({});

	useEffect(() => {
		getStats();
	}, []);

	async function getStats() {
		const { data, errors } = await altogic.db.model('orders').group('status').compute({
			name: 'count',
			type: 'count'
		});
		if (errors) {
			return location.reload();
		}
		// @ts-ignore
		const stats = data?.reduce((acc, curr) => {
			acc[curr.groupby.group] = curr.count;
			return acc;
		}, {}) as Stats;

		setStats(stats);
		return '';
	}
	return (
		<AdminLayout title="Dashboard">
			<section>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-4">
					{Object.entries(stats).map(([status, count], index) => (
						<article
							key={index}
							className="group cursor-pointer hover:bg-gray-50 flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-6"
						>
							<span className="rounded-full bg-blue-100 p-3 text-blue-600">
								<BiStats size={25} />
							</span>

							<div>
								<p className="text-2xl font-medium tabular-nums text-gray-900">{count}</p>

								<p className="text-sm text-gray-500">{capitalize(status)} orders</p>
							</div>
						</article>
					))}
				</div>
			</section>
		</AdminLayout>
	);
}
