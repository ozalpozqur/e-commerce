import { Modal } from 'flowbite-react';
import Button from './ui/Button';
import { FormEvent, MouseEvent, useEffect, useId, useRef, useState } from 'react';
import Input from './ui/Input';
import { Tooltip } from 'react-tooltip';

interface InputModalProps {
	isOpen: boolean;
	label?: string;
	close: () => void;
	onSubmit: (value: string) => void;
	loading?: boolean;
	defaultValue?: string;
}
export default function InputModal({ isOpen, defaultValue, close, onSubmit, loading, label }: InputModalProps) {
	const input = useRef<HTMLInputElement>(null);
	const id = useId();

	useEffect(() => {
		if (!isOpen) return;
		function handler(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				close?.();
			}
		}

		document.addEventListener('keydown', handler);

		return () => {
			document.removeEventListener('keydown', handler);
		};
	}, [isOpen]);

	function clickOutSide(event: MouseEvent) {
		if (event.target === event.currentTarget) close?.();
	}

	function submitHandler(e: FormEvent) {
		e.preventDefault();
		if (input.current?.value) onSubmit(input.current.value);
	}

	return (
		<Modal
			onClick={clickOutSide}
			className="!h-full [&>:first-child]:h-auto"
			show={isOpen}
			size="md"
			popup={true}
			onClose={() => close?.()}
		>
			<Modal.Header />
			<Modal.Body>
				<form onSubmit={submitHandler}>
					<div className="flex flex-col gap-1 mb-2">
						{label && (
							<label className="font-medium text-sm" htmlFor={id}>
								{label}
							</label>
						)}
						<Input
							defaultValue={defaultValue}
							ref={input}
							placeholder="Type order's tracking URL"
							type="url"
							id={id}
							required
						/>
					</div>
					<Button loading={loading} full type="submit">
						Save
					</Button>
				</form>
			</Modal.Body>
		</Modal>
	);
}
