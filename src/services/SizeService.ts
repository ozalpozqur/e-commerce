import { altogicOnlyRead } from '../libs/altogic';
import { Size } from '../types/altogic';

export default class SizeService {
	static async getSizes() {
		const { data, errors } = await altogicOnlyRead.db.model('sizes').get();

		if (errors) throw errors;

		return data as Size[];
	}
}
