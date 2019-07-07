const IdTokenClient = require('./index')

// The URL of your Cloud Run or Cloud Functions that authenticates requests.
// You must give the corresponding service account key the invoker IAM role to invoke the url correctly.
const baseUrl = 'https://<my-cloud-run-of-gcf-url>/<suburl>/<is>/<ok>'

// You must generate the service account key in advance
const serviceAccountKeyPath = './key.json'


;(async () => {
    const client = new IdTokenClient({
        url: baseUrl,
        serviceAccountKeyPath,
    })
    await client.getIdToken()

    const res = await client.request({
        url: baseUrl,
    })
    console.log(res.body)
})()