const { createClient } = require('altogic');

let altogic;

//altogic = createClient(ENV_URL, CLIENT_KEY);
/*
const exampleJson = {
	id: 'evt_1MI5ETG2RiuGq8HDpIyMEZpE',
	data: {
		object: {
			id: 'cs_test_a1L9dr6A3JIZOESRzm50t4PuNKbT0ihyQsGRVP835ILCRdUVtNZVics3im',
			object: 'checkout.session',
			amount_subtotal: 153695,
			amount_total: 153695,
			cancel_url: 'http://localhost:5173/cancel',
			currency: 'usd',
			custom_text: {
				shipping_address: null,
				submit: null
			},
			customer_details: {
				address: {
					city: null,
					country: 'TR',
					line1: null,
					line2: null,
					postal_code: null,
					state: null
				},
				email: 'ozgurozalp1999@gmail.com',
				name: 'Özgür ÖZALP',
				phone: null,
				tax_exempt: 'none',
				tax_ids: []
			},
			customer_email: 'ozgurozalp1999@gmail.com',
			expires_at: 1671865156,
			metadata: {
				product_1_altogic_id: '63a438d9a432b505611cc0a1'
			},
			mode: 'payment',
			payment_intent: 'pi_3MI5ERG2RiuGq8HD0pJuWFfv',
			status: 'complete',
			success_url: 'http://localhost:5173/success'
		}
	},
	request: {
		id: null,
		idempotency_key: null
	},
	type: 'checkout.session.completed'
};
*/

module.exports = async function (req, res) {
	const ENV_URL = 'https://e-commerce.c1-europe.altogic.com';
	const CLIENT_KEY = req.appParams.SERVERLESS_FUNCTION_CLIENT_KEY;

	if (!ENV_URL || !CLIENT_KEY) {
		return console.warn(
			'Client library environment URL and/or client key variables are not set. Unless these variables are set, the cloud function cannot use Altogic Client Library.'
		);
	}

	altogic = createClient(ENV_URL, CLIENT_KEY);

	const userEmail = req.body.data.object.customer_email;
	const user = await getUserByEmail(altogic, userEmail);

	switch (req.body.type) {
		case 'checkout.session.completed': {
			await completed(altogic, req, res, user);
			break;
		}

		default: {
			await res.json({ code: 'unknown handler' }, 500);
		}
	}
};

async function getUserByEmail(altogic, email) {
	const { data: user } = await altogic.db.model('users').filter(`email == '${email}'`).getSingle();
	return user;
}

async function completed(altogic, req, res, user) {
	const { data: paymentCheck, errors: checkingError } = await altogic.db
		.model('orders')
		.filter(`stripeCheckoutId == '${req.body.data.object.payment_intent}'`)
		.getSingle();

	if (checkingError) {
		console.warn(checkingError);
	}

	if (paymentCheck) {
		return res.json({ message: 'The order has already been processed' });
	}

	const { errors: cartDeleteError } = await altogic.db.model('cart').filter(`user == '${user._id}'`).delete();

	if (!cartDeleteError) {
		altogic.realtime.send(user._id, 'cleared-cart', true);
		altogic.realtime.close();
	} else {
		console.warn(cartDeleteError);
	}

	const data = {
		totalPrice: req.body.data.object.amount_total / 100,
		status: 'waiting',
		stripeCheckoutId: req.body.data.object.payment_intent,
		...(user && { user: user._id })
	};

	const { data: order, errors } = await altogic.db.model('orders').create(data);
	const orderItemIds = Object.values(req.body.data.object.metadata).filter(Boolean);
	const orderItemsFilter = orderItemIds.map(item => `_id == '${item.split('-')[0]}'`).join(' || ');

	if (errors) {
		return res.json(errors, errors.status);
	}

	const { errors: orderItemsErrors } = await altogic.db.model('orderItems').filter(orderItemsFilter).update({
		order: order._id
	});

	for (let orderItemId of orderItemIds) {
		const [_, quantity, productId] = orderItemId.split('-');
		const { errors } = await altogic.db
			.model('products')
			.object(productId)
			.updateFields({
				field: 'qtyInStock',
				updateType: 'decrement',
				value: Number(quantity)
			});
		if (errors) console.warn(errors);
	}

	if (orderItemsErrors) {
		return res.json(orderItemsErrors, orderItemsErrors.status);
	}

	await res.json({ message: 'ok' }, 201);
}
