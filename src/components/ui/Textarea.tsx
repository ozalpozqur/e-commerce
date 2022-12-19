import { ComponentPropsWithRef, ForwardedRef, forwardRef, useId } from 'react';
import { cn } from '../../helpers';

export interface TextAreaProps extends ComponentPropsWithRef<'textarea'> {
	showError?: boolean;
	errorMessage?: string;
	label?: string;
	className?: string;
}
const TextArea = forwardRef(
	(
		{ className, rows, cols, label, showError = false, errorMessage, ...props }: TextAreaProps,
		ref: ForwardedRef<HTMLTextAreaElement>
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
					<textarea
						ref={ref}
						id={id}
						rows={rows}
						cols={cols}
						className={cn(
							'shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md',
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

export default TextArea;
