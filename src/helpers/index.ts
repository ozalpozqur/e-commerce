export function cn(...classNames: any[]) {
    return classNames.filter(Boolean).join(' ');
}

export default function moneyFormat(number: number) {
    return new Intl.NumberFormat("en-EN",{
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ).format(number);
}