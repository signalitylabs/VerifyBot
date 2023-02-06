const request   = require('request');

const CLIENT_ID = process.env.PAYPAL_CLIENT;
const SECRET    = process.env.PAYPAL_SECRET;

const url       = 'https://api-m.paypal.com/v1/';

module.exports = class PayPalAPI {

    constructor() {

        const options = {
            url: url + 'oauth2/token',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Language': 'en_US',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + new Buffer.from(CLIENT_ID + ':' + SECRET).toString('base64')
            },
            form: {
                'grant_type': 'client_credentials'
            }
        };

        request(options, (e, r, data) => {
            if(e) throw e;
            this.TOKEN = JSON.parse(data).access_token;
        });
    }

    async searchForBuyer(email) {
        const today         = new Date().toISOString();
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

        return new Promise(async (resolve, reject) => {
            const options = {
                    method: 'GET',
                    url: url + 'reporting/transactions',
                    headers: {
                        'Authorization': 'Bearer ' + this.TOKEN,
                        'content-type': 'application/json',
                        'Accept-Language': 'en_US',
                    },
                    qs: {
                        'start_date': thirtyDaysAgo,
                        'end_date': today,
                        'fields': 'all'
                    }
                };
                
            var foundBuyer = false;
    
            await request(options, (e, r, data) => {
                if (e) throw new Error(e);
                var history =  JSON.parse(data).transaction_details;
    
                for(var x = 0; x < history.length; x++) {
                    if(history[x].payer_info.email_address == email) {
                        var subject = history[x].transaction_info.transaction_subject;
    
                        if(subject.includes('Epic Core')) {
                            foundBuyer = true;
                            resolve(foundBuyer);
                        }
                    }
                }
    
                resolve(foundBuyer);
            });
        });
    }
}