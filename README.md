# Identity Token Client for Google Cloud Run / Google Cloud Functions
This module uses ``request``. You can pass a ``request`` options object to ``IdTokenClient.request()``.

## How to Use
1. Create a JSON key for a service account and download it
2. Grant the invoker premission to that service account
3. Run ``example.js``. You don't need to specify ADC since this module does not rely on ``google-auth-library`` or anything like this.

## TODO
- Automatic refreshing after expiration