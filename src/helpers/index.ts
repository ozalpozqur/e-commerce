export function cn(className: string, ...rest: any[]) {
	return `${className} ${rest.filter(Boolean).join(' ')}`;
}
