import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Success() {
	const location = useLocation();

	useEffect(() => {
		console.log(location);
	}, []);

	return <></>;
}
