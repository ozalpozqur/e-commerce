import { Fragment, useEffect, useState } from 'react';
import { Dialog, Popover, Tab, Transition } from '@headlessui/react';
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '../helpers';
import { Link, useLocation } from 'react-router-dom';
import useCartStore from '../store/cart';
import useAuthStore from '../store/auth';

const navigation = {
	pages: [
		{ name: 'Company', href: '#' },
		{ name: 'Stores', href: '#' }
	]
};

const rightNavigationForGuest = [
	{
		name: 'Login',
		href: '/auth/login'
	},
	{
		name: 'Create Account',
		href: '/auth/register'
	}
];
const rightNavigationForAuth = [
	{
		name: 'Profile',
		href: '/profile'
	},
	{
		name: 'Logout',
		href: '/auth/logout'
	}
];

export default function Header() {
	const [open, setOpen] = useState(false);
	const { pathname } = useLocation();
	const { items } = useCartStore();
	const { user } = useAuthStore();

	useEffect(() => {
		if (user?.isAdmin && !rightNavigationForAuth.find(item => item.href === '/admin')) {
			rightNavigationForAuth.unshift({ name: 'Admin Panel', href: '/admin' });
		}
	}, []);

	return (
		<div className="bg-white">
			{/* Mobile menu */}
			<Transition.Root show={open} as={Fragment}>
				<Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
					<Transition.Child
						as={Fragment}
						enter="transition-opacity ease-linear duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity ease-linear duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 z-40 flex">
						<Transition.Child
							as={Fragment}
							enter="transition ease-in-out duration-300 transform"
							enterFrom="-translate-x-full"
							enterTo="translate-x-0"
							leave="transition ease-in-out duration-300 transform"
							leaveFrom="translate-x-0"
							leaveTo="-translate-x-full"
						>
							<Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
								<div className="flex px-4 pt-5 pb-2">
									<button
										type="button"
										className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
										onClick={() => setOpen(false)}
									>
										<span className="sr-only">Close menu</span>
										<XMarkIcon className="h-6 w-6" aria-hidden="true" />
									</button>
								</div>

								<div className="space-y-6 border-t border-gray-200 py-6 px-4">
									{navigation.pages.map((page, index) => (
										<div key={index} className="flow-root">
											<a href={page.href} className="-m-2 block p-2 font-medium text-gray-900">
												{page.name}
											</a>
										</div>
									))}
								</div>

								<div className="space-y-6 border-t border-gray-200 py-6 px-4">
									{(user ? rightNavigationForAuth : rightNavigationForGuest).map((nav, index) => (
										<div key={index} className="flow-root">
											<Link
												to={nav.href}
												className={cn(
													'-m-2 block p-2 font-medium text-gray-900 border-b-2 border-transparent',
													pathname === nav.href ? '!border-gray-600' : ''
												)}
											>
												{nav.name}
											</Link>
										</div>
									))}
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition.Root>

			<header className="relative bg-white">
				<nav aria-label="Top" className="mx-auto container px-4">
					<div className="border-b border-gray-200">
						<div className="flex h-16 items-center">
							<button
								type="button"
								className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
								onClick={() => setOpen(true)}
							>
								<span className="sr-only">Open menu</span>
								<Bars3Icon className="h-6 w-6" aria-hidden="true" />
							</button>

							{/* Logo */}
							<div className="ml-4 flex lg:ml-0">
								<Link to="/">
									<span className="sr-only">Your Company</span>
									<span className="font-bold">SHOP</span>
								</Link>
							</div>

							{/* Flyout menus */}
							<Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
								<div className="flex h-full space-x-8">
									{navigation.pages.map(page => (
										<a
											key={page.name}
											href={page.href}
											className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
										>
											{page.name}
										</a>
									))}
								</div>
							</Popover.Group>

							<div className="ml-auto flex items-center">
								<div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
									{(user ? rightNavigationForAuth : rightNavigationForGuest).map((nav, index) => (
										<Link
											key={index}
											to={nav.href}
											className={cn(
												'text-sm font-medium text-gray-700 hover:text-gray-800 border-b-2 border-transparent',
												pathname === nav.href ? 'border-gray-600' : ''
											)}
										>
											{nav.name}
										</Link>
									))}
								</div>

								{/* Search */}
								<div className="flex lg:ml-6">
									<a href="#" className="p-2 text-gray-400 hover:text-gray-500">
										<span className="sr-only">Search</span>
										<MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
									</a>
								</div>

								{/* Cart */}
								<div className="ml-4 flow-root lg:ml-6">
									<Link to="/cart" className="group -m-2 flex items-center p-2">
										<ShoppingBagIcon
											className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
											aria-hidden="true"
										/>
										<span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
											{items.length}
										</span>
										<span className="sr-only">items in cart, view bag</span>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</nav>
			</header>
		</div>
	);
}
