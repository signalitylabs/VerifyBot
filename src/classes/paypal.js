const request   = require('request');

const CLIENT_ID = process.env.PAYPAL_CLIENT;
const SECRET    = process.env.PAYPAL_SECRET;

const url       = 'https://api-m.paypal.com/v1/';
const config    = require('../config.json');

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
        var endDate     = new Date();
        var startDate   = this.thirtyDaysAgo(endDate);

        for(var i = 0; i < config.PayPal[0].monthsToCheck; i++) { 
            console.log(`Searching for ${email} between ${startDate.toDateString()} and ${endDate.toDateString()}`);
            var foundBuyer = await this.searchBuyerHistory(email, startDate, endDate);
            if(foundBuyer != false) {
                return foundBuyer;
            }

            endDate = startDate;
            startDate = this.thirtyDaysAgo(startDate);
        }

        return false;
    }

    async searchBuyerHistory(email, startDate, endDate) {
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
                        'start_date': startDate.toISOString(),
                        'end_date': endDate.toISOString(),
                        'fields': 'all'
                    }
                };
                
            var foundBuyer = false;
    
            await request(options, (e, r, data) => {
                if (e) throw new Error(e);
                var history =  JSON.parse(data).transaction_details;
    
                for(var i = 0; i < config.Verify.length; i++) {
                    var roleID = config.Verify[i]['discordRoleID'];
                    var searchFor = config.Verify[i]['searchFor'].toLowerCase();

                    for(var x = 0; x < history.length; x++) {
                        if(history[x].payer_info.email_address == email) {
                            var subject = history[x].transaction_info.transaction_subject.toLowerCase();
        
                            if(subject.includes(searchFor)) {
                                foundBuyer = roleID;
                                resolve(foundBuyer);
                            }
                        }
                    }
                }
    
                resolve(foundBuyer);
            });
        });
    }


    thirtyDaysAgo(date) {
        return new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
}