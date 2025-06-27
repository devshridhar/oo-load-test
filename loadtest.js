import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    vus: 10000,
    duration: '30s',
};

export default function () {
    let loginRes = http.post('https://yourapp.com/api/login', {
        username: 'testuser',
        password: '123456'
    });
    check(loginRes, { 'logged in': (r) => r.status === 200 });

    const token = loginRes.json('token');

    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    let cartRes = http.post('https://yourapp.com/api/cart/add', JSON.stringify({
        product_id: 101,
        qty: 1
    }), { headers });
    check(cartRes, { 'added to cart': (r) => r.status === 200 });

    let orderRes = http.post('https://yourapp.com/api/order/checkout', null, { headers });
    check(orderRes, { 'order success': (r) => r.status === 200 });

    sleep(1);
}
