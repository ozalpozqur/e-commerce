import { RotatingLines } from 'react-loader-spinner';
export default function ScreenLoader() {
	return (
		<div className="fixed inset-0 z-[99999] flex items-center justify-center">
			<RotatingLines strokeColor="#4c51bf" strokeWidth="5" animationDuration="0.75" width="96" visible={true} />
		</div>
	);
}
