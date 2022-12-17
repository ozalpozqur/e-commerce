import { NavLink } from 'react-router-dom';
import useGlobalStore from '../store/global';
import Dropdown, { Item } from './ui/Dropdown';
import useAuthStore from '../store/auth';
import { BiUserCircle, TfiMenu } from 'react-icons/all';
import ShoppingCart from './ShoppingCart';

export default function Navbar() {
	const { toggleSidebar } = useGlobalStore();
	const { user, logout } = useAuthStore();

	const authDropdown: Item[] = [
		{
			title: 'Admin',
			to: '/admin'
		},
		{
			title: 'Profile',
			to: '/profile'
		},
		{
			title: 'Sign out',
			onClick: logout
		}
	];
	const unAuthDropdown: Item[] = [
		{
			title: 'Login',
			to: '/auth/login'
		},
		{
			title: 'Register',
			to: '/auth/register'
		}
	];

	return (
		<div className="h-16 lg:h-20 border-b-2 border-secondary flex gap-2 justify-between sticky bg-white z-10 top-0">
			<nav className="flex h-full overflow-x-auto">
				<button
					onClick={toggleSidebar}
					className="flex sticky bg-white left-0 lg:hidden items-center justify-center p-4 transition hover:bg-secondary border-r-2 border-secondary"
				>
					<TfiMenu size={20} />
				</button>
				<NavLink
					className="flex items-center justify-center px-6 lg:px-10 transition hover:bg-secondary border-r-2 border-secondary"
					to="/"
				>
					Home
				</NavLink>
				<NavLink
					className="flex items-center justify-center px-6 lg:px-10 transition hover:bg-secondary border-r-2 border-secondary"
					to="/"
				>
					Bla
				</NavLink>
				<NavLink
					className="flex items-center justify-center px-6 lg:px-10 transition hover:bg-secondary border-r-2 border-secondary"
					to="/"
				>
					Bla
				</NavLink>
				<NavLink
					className="flex items-center justify-center px-6 lg:px-10 transition hover:bg-secondary border-r-2 border-secondary"
					to="/"
				>
					Categories
				</NavLink>
				<NavLink
					className="flex items-center justify-center px-6 lg:px-10 transition hover:bg-secondary border-r-2 border-secondary"
					to="/"
				>
					Brands
				</NavLink>
			</nav>
			<div className="flex">
				<ShoppingCart />
				<Dropdown className="h-full" items={user ? authDropdown : unAuthDropdown}>
					<button className="h-full group flex transition hover:bg-secondary items-center border-l-2 border-secondary gap-4 justify-center px-4 lg:px-6">
						<BiUserCircle size={30} />
						{user && <span className="hidden lg:inline">{user?.name}</span>}
					</button>
				</Dropdown>
			</div>
		</div>
	);
}
