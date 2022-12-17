import { ComponentPropsWithRef, ForwardedRef, forwardRef, useId } from 'react';
import { cn } from '../../helpers';

export interface InputProps extends ComponentPropsWithRef<'input'> {
	showError?: boolean;
	errorMessage?: string;
	label?: string;
	className?: string;
}
const Input = forwardRef(
	(
		{ type = 'text', className, label, showError = false, errorMessage, ...props }: InputProps,
		ref: ForwardedRef<HTMLInputElement>
	) => {
		const id = useId();

		return (
			<div className={className}>
				{label ? (
					<label htmlFor={id} className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
						{label}
					</label>
				) : undefined}
				<div className="mt-1 sm:mt-0 sm:col-span-2">
					<input
						ref={ref}
						type={type}
						id={id}
						className={cn(
							'max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md',
							showError ? 'border-red-600' : ''
						)}
						{...props}
					/>
					{showError ? <small className="text-red-600">{errorMessage}</small> : undefined}
				</div>
			</div>
		);
	}
);

export default Input;
