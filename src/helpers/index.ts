import { APIError } from 'altogic';

export function cn(...classNames: any[]) {
	return classNames.filter(Boolean).join(' ');
}

export default function moneyFormat(number: number) {
	return new Intl.NumberFormat('en-EN', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(number);
}
const d = [
	{
		origin: 'client_error',
		code: 'not_unique',
		message:
			"The value 'deneme' of field 'name' is not unique. There is already an object with the same value in collection.",
		details: {
			field: 'name',
			value: 'deneme'
		}
	}
];
export function parseAltogicAPIError(errors: APIError) {
	return errors.items.map(item => {
		return {
			error: item.code,
			// @ts-ignore
			field: item.details.field,
			// @ts-ignore
			value: item.details.value
		};
	});
}
