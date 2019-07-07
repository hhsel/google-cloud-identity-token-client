const { KJUR } = require('jsrsasign')
const request = require('request')

const GOOGLE_OAUTH_URL = 'https://www.googleapis.com/oauth2/v4/token'

class IdTokenClient {
    constructor(options) {
        const { url, serviceAccountKeyPath } = options
        if (!url) { throw new Error('url not defined') }
        if (!serviceAccountKeyPath) { throw new Error('serviceAccountKeyPath not defined') }

        this.targetUrl = url
        this.key = require(serviceAccountKeyPath)
        this.credential = this._createCredential()
        this.header = { alg: 'RS256', typ: 'JWT' }
        this.jwt = this._createJwt()
        this.token = null
    }

    _createJwt() {
        const { credential } = this
        const { header } = this

        const data = {
            iss: credential.client_email,
            aud: GOOGLE_OAUTH_URL,
            target_audience: this.targetUrl,
            exp: KJUR.jws.IntDate.get('now + 1hour'),
            iat: KJUR.jws.IntDate.get('now'),
        }

        return KJUR.jws.JWS.sign(
            header.alg,
            JSON.stringify(header),
            JSON.stringify(data),
            credential.private_key
        )
    }

    _createCredential() {
        const { key } = this
        return {
            private_key_id: key.private_key_id,
            private_key: key.private_key,
            client_email: key.client_email,
            client_id: key.client_id,
            type: 'service_account',
        }
    }

    async getIdToken() {
        const { jwt } = this

        return new Promise( (resolve, reject) => {
            const options = {
                method: 'POST',
                url: GOOGLE_OAUTH_URL,
                form: {
                    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
                    assertion: jwt,
                }
            }

            request(options, (err, res) => {
                if (err) { reject() }

                const resObj = JSON.parse(res.body)
                const token = resObj.id_token
                if (token) {
                    this.token = token
                    resolve(token)
                } else {
                    reject()
                }
            })
        })
    }

    async request(options) {
        return new Promise(async (resolve, reject) => {
            const { token } = this
            if (!token) {
                reject()
            }

            const o = {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${token}`,
                }
            }

            request(o, (err, res, body) => {
                if (err) {
                    reject()
                }

                resolve(res)
            })
        })
    }

}


module.exports = IdTokenClient