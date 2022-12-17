import { Outlet, useLoaderData } from 'react-router-dom';
import useCategoryStore from '../../store/category';
import { useEffect } from 'react';

export default function Default() {
	const data = useLoaderData();
	const { setCategories } = useCategoryStore();

	useEffect(() => {
		// @ts-ignore
		setCategories(data);
	}, []);

	return <Outlet />;
}
