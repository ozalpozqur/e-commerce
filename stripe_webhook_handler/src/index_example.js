const { createClient } = require('altogic');

const ENV_URL = null; // YOUR_ENV_URL
const CLIENT_KEY = null; // YOUR_CLIENT_KEY
let altogic;

module.exports = async function (req, res) {
    if (!ENV_URL || !CLIENT_KEY) {
        return console.warn(
            'Client library environment URL and/or client key variables are not set. Unless these variables are set, the cloud function cannot use Altogic Client Library.'
        );
    }

    altogic = createClient(ENV_URL, CLIENT_KEY);

    const user = await getUserByEmail(altogic, req.body.data.object.customer_email);

    switch (exampleJson.type) {
        case 'checkout.session.completed': {
            await completed(altogic, req, res, user);
            break;
        }

        default: {
            res.json({ code: 'unknown handler' }, 500);
        }
    }
};

async function getUserByEmail(altogic, email) {
    const { data, errors } = await altogic.db.model('users').filter(`email == '${email}'`).getSingle();
    return data;
}

async function completed(altogic, req, res, user) {
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
        ...(user && { user: user._id }),
    };

    const { data: order, errors } = await altogic.db.model('orders').create(data);
    const orderItemsFilter = Object.values(req.body.data.object.metadata)
        .map(item => `_id == '${item}'`)
        .join(' || ');

    if (errors) {
        return res.json(errors, errors.status);
    }

    const { errors: orderItemsErrors } = await altogic.db.model('orderItems').filter(orderItemsFilter).update({
        order: order._id,
    });

    if (orderItemsErrors) {
        return res.json(orderItemsErrors, orderItemsErrors.status);
    }

    res.json({ message: 'ok' }, 201);
}
