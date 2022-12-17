import { Link } from 'react-router-dom';
import { cn } from '../../helpers';
import { Fragment } from 'react';

export interface Item {
	title: string;
	onClick?: () => void;
	to?: string;
}
interface DropdownProps {
	items: Item[];
	children: JSX.Element;
	className?: string;
}
export default function Dropdown({ items, children, className }: DropdownProps) {
	return (
		<div className={cn('relative group', className)}>
			{children}
			<div
				className="hidden group-focus-within:block absolute right-1 z-10 mt-2 w-56 origin-top-right rounded-md border border-gray-100 bg-white shadow-lg"
				role="menu"
			>
				<div className="flow-root py-2">
					<div className="-my-2 divide-y divide-gray-100">
						<div className="p-2">
							{items.map((item, index) => (
								<Fragment key={index}>
									{item?.to ? (
										<Link
											className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
											to={item.to}
										>
											{item.title}
										</Link>
									) : (
										<button
											className="block w-full text-left rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
											role="menuitem"
											onClick={item?.onClick}
										>
											{item.title}
										</button>
									)}
								</Fragment>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
