
import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    vus: 10000,
    duration: '30s',
};

export default function () {
    // Step 1: Login and get token
    const loginPayload = JSON.stringify({
        mobile: '9008427482',
        otp: '3456'
    });

    const loginHeaders = {
        'Content-Type': 'application/json',
    };

    let loginRes = http.post('https://oo-api.posnic.io/signin', loginPayload, { headers: loginHeaders });
    check(loginRes, { 'login success': (r) => r.status === 200 });

    const token = loginRes.json('token');

    const authHeaders = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    // Step 2: Fetch items
    let itemsRes = http.get('https://oo-api.posnic.io/items?branchId=67f765015fc6ff7612017133', { headers: authHeaders });
    check(itemsRes, { 'items fetched': (r) => r.status === 200 });

    // Step 3: Place order (sample static order)
    const orderPayload = JSON.stringify({
        customer: "Sridhar",
        date: "2025-06-28",
        slot: "8:30am-9:00am",
        slotFrom: "2025-06-28T03:00:00.000Z",
        slotTo: "2025-06-28T03:30:00.000Z",
        validUntil: "2025-06-27T08:30:00.897Z",
        items: [
            {
                id: "684a56198f7649c784a79023",
                name: "Pepsi",
                price: 40,
                quantity: 1,
                total: 40
            },
            {
                id: "684a56d98f7649c784a79027",
                name: "Thums Up",
                price: 40,
                quantity: 1,
                total: 40
            }
        ],
        totalAmount: 80
    });

    let orderRes = http.post('https://oo-api.posnic.io/order', orderPayload, { headers: authHeaders });
    check(orderRes, { 'order placed': (r) => r.status === 200 });

    sleep(1);
}
