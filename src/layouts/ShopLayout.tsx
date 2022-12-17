import { ReactElement, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
interface ShopLayoutProps {
	children: ReactElement;
}
export default function ShopLayout({ children }: ShopLayoutProps) {
	return (
		<>
			<Header />
			<div className="container mx-auto">{children}</div>
		</>
	);
}
