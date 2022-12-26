import { Modal } from 'flowbite-react';
import Button from './ui/Button';

interface ConfirmModalProps {
	isOpen: boolean;
	close: () => void;
	onConfirm: () => void;
	confirmText?: string;
	loading?: boolean;
}
export default function ConfirmModal({ isOpen, close, onConfirm, confirmText, loading }: ConfirmModalProps) {
	const onClose = () => {
		close?.();
	};

	return (
		<Modal show={isOpen} size="md" popup={true} onClose={onClose}>
			<Modal.Header />
			<Modal.Body>
				<div className="text-center">
					<h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
						{confirmText ?? 'Are you sure?'}
					</h3>
					<div className="flex justify-center gap-4">
						<Button loading={loading} variant="danger" onClick={onConfirm}>
							Yes, I'm sure
						</Button>
						<Button variant="secondary" onClick={onClose}>
							No, cancel
						</Button>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
}
