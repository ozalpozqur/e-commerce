import { ComponentPropsWithRef, ForwardedRef, forwardRef, useId } from 'react';
import { cn } from '../../helpers';

export interface InputProps extends ComponentPropsWithRef<'select'> {
	showError?: boolean;
	errorMessage?: string;
	fields: {
		id: string | number;
		value: string;
	}[];
	label?: string;
	className?: string;
}
const Input = forwardRef(
	(
		{ fields, value, className, label, showError = false, errorMessage, ...props }: InputProps,
		ref: ForwardedRef<HTMLSelectElement>
	) => {
		const id = useId();

		return (
			<div className={className}>
				<select
					id={id}
					value={value}
					className={cn(
						'max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md',
						showError ? 'border-red-600' : ''
					)}
					{...props}
				>
					<option className="text-gray-50">Select a category</option>
					{fields.map(field => (
						<option value={field.id} key={field.id}>
							{field.value}
						</option>
					))}
				</select>
				{showError ? <small className="text-red-600">{errorMessage}</small> : undefined}
			</div>
		);
	}
);

export default Input;
