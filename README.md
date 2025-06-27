# 🧪 k6 Load Testing Project (Simulate 10,000 Users Ordering)

This project simulates 10,000 virtual users accessing a shopping app, logging in, adding a product to the cart, and placing an order using [k6](https://k6.io), a modern load testing tool.

---

## 📦 Project Setup

### 1. Clone / Download this repo
Or create a new directory and initialize with:

```bash
mkdir k6-loadtest
cd k6-loadtest
npm init -y
```

### 2. Create the test script

Save the following as `loadtest.js`:

```js
import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10000,          // Number of virtual users
  duration: '30s',     // Test duration
};

export default function () {
  // Step 1: Login
  let loginRes = http.post('https://yourapp.com/api/login', {
    username: 'testuser',
    password: '123456'
  });
  check(loginRes, { 'logged in': (r) => r.status === 200 });

  // Extract JWT token
  const token = loginRes.json('token');

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // Step 2: Add to Cart
  let cartRes = http.post('https://yourapp.com/api/cart/add', JSON.stringify({
    product_id: 101,
    qty: 1
  }), { headers });
  check(cartRes, { 'added to cart': (r) => r.status === 200 });

  // Step 3: Place Order
  let orderRes = http.post('https://yourapp.com/api/order/checkout', null, { headers });
  check(orderRes, { 'order success': (r) => r.status === 200 });

  sleep(1);
}
```

---

## 🛠️ Installation Guide

### 1. Install k6

#### macOS (Homebrew)
```bash
brew install k6
```

#### Ubuntu/Debian
```bash
curl -fsSL https://dl.k6.io/key.gpg | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/k6.gpg
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt update
sudo apt install k6
```

#### Windows (Chocolatey)
```bash
choco install k6
```

Or download from [https://github.com/grafana/k6/releases](https://github.com/grafana/k6/releases)

---

## 🚀 Run the Load Test

### Option 1: Direct k6 command
```bash
k6 run loadtest.js
```

### Option 2: Using NPM script

Update your `package.json`:
```json
"scripts": {
  "test": "k6 run loadtest.js"
}
```

Then run:
```bash
npm run test
```

---

## 📂 Project Structure

```
k6-loadtest/
├── loadtest.js         # k6 test script
├── package.json        # NPM config
└── README.md           # This file
```

---

## 📈 Output Metrics

k6 will show:
- Success/failure per endpoint
- Request rate and throughput
- Response time (avg, min, max)
- HTTP status codes

---

## 📌 Notes

- Update API URLs and payloads in `loadtest.js` to match your actual backend.
- You can scale the test by adjusting `vus` (virtual users) and `duration`.

---

## 💬 Need Help?

Visit [https://k6.io/docs/](https://k6.io/docs/) for advanced configuration.
