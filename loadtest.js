import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    stages: [
        { duration: '5s', target: 1000 },
        { duration: '10s', target: 2000 },
        { duration: '20s', target: 4000 },
    ],
};


export default function () {
    // Step 1: Login using GET request
    let loginRes = http.get('http://oo-api.posnic.io/login');

    if (!loginRes || loginRes.status !== 200 || !loginRes.body.includes('token')) {
        console.error('Login failed or invalid login response');
        return;
    }

    const token = loginRes.json('token');
    if (!token || typeof token !== 'string') {
        console.error('Invalid token structure');
        return;
    }

    const authHeaders = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    // Step 2: Fetch items
    let itemsRes = http.get('http://oo-api.posnic.io/items?branchId=67f765015fc6ff7612017133', { headers: authHeaders });
    check(itemsRes, { 'items fetched': (r) => r.status === 200 });

    // Step 3: Place order
    const orderPayload = JSON.stringify({
        customer: "Satheesh",
        date: "2025-06-28",
        slot: "8:30am-9:00am",
        slotFrom: "2025-06-28T03:00:00.000Z",
        slotTo: "2025-06-28T03:30:00.000Z",
        validUntil: "2025-06-27T08:30:00.897Z",
        items: [
            { id: "684a56198f7649c784a79023", name: "Pepsi", price: 40, quantity: 1, total: 40 },
            { id: "684a56d98f7649c784a79027", name: "Thums Up", price: 40, quantity: 1, total: 40 }
        ],
        totalAmount: 80
    });

    let orderRes = http.post('http://oo-api.posnic.io/order', orderPayload, { headers: authHeaders });
    check(orderRes, { 'order placed': (r) => r.status === 200 });

    sleep(1);
}
