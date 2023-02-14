const request   = require('request');
const fs        = require('fs');

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


    /**
     * Function to clear all of the saved cache
     */
    async cacheClear() {
        //Flush the bot's cache to help keep things tidy
        try {
            var cacheCount = 0;
            var cacheLoader = await fs.readdirSync(`./cache`);

            for(var x = 0; x < cacheLoader.length; x++) {
                var cache  = cacheLoader[x];
                
                if(cache.endsWith('.json')) { 
                    //Grab the age of the file
                    var stats = await fs.statSync(`./cache/${cache}`);
                    //See how old the file is
                    var diff = Math.abs(new Date() - new Date(stats.mtime)) / 1000;
                    //... in minutes
                    var mins = (diff / 60);

                    // Is it stale?
                    if(mins > config.PayPal[0].cacheExpiresInMins) {
                        cacheCount++;
                        await fs.unlink(`./cache/${cache}`, (err => {
                            if (err) console.log(`${cacheCount}> ${err}`);
                        }));
                    }
                }
            }
        } catch (e) {
            console.log(`Cannot clear cache folder`);
        }
    }

    async pullRequest(options) {
        // Clear the cache
        await this.cacheClear();
        
        // Check if the cache folder exists
        if (!fs.existsSync(`./cache`)) fs.mkdirSync(`./cache`);

        // Set the filename
        if(options.qs.start_date != undefined && options.qs.end_date != undefined) {
            var startDate   = new Date(options.qs.start_date).toDateString();
            var endDate     = new Date(options.qs.end_date).toDateString();
            var filename = `./cache/${startDate.replace(/\W/g, '')}-${endDate.replace(/\W/g, '')}.json`;
        } else {
            var filename = `./cache/${options.url.replace(/\W/g, '')}.json`;
        }

        // Check if the file exists
        if (fs.existsSync(filename)) {
            //Grab the age of the file
            var stats = await fs.statSync(filename);
            //See how old the file is
            var diff = Math.abs(new Date() - new Date(stats.mtime)) / 1000;
            //... in minutes
            var mins = (diff / 60);

            // Is it still fresh?
            if( config.PayPal[0].cacheExpiresInMins < mins) {
                return new Promise((resolve, reject) => {
                    fs.readFile(filename, (e, data) => {
                        if(e) throw e;
                        resolve(data);
                    });
                });
            }
        }

        // If we get here, the file is either not there or it's stale
        return new Promise((resolve, reject) => {
            request(options, (e, r, data) => {
                if(e) throw e;
                fs.writeFile(filename, data, (e) => { if(e) throw e; });
                resolve(data);
            })
        });
    }

    async searchForBuyer(email, interaction) {
        var endDate     = new Date();
        endDate.setDate(endDate.getDate() + 1);
        
        var startDate   = this.thirtyDaysAgo(endDate);
        var member      = interaction.member.user.tag + ` (${interaction.member.id})`;

        console.log(`${member} > Searching for ${email}`);

        for(var i = 0; i < config.PayPal[0].monthsToCheck; i++) { 

            console.log(`${member} > Searching ${startDate} to ${endDate}`);
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
                'transaction_status': 'S',
                'fields': 'all'
            }
        };

        var foundBuyer  = false;
        var data        = await this.pullRequest(options);
        var history     = JSON.parse(data).transaction_details;

        if(config.Verify == undefined) {
            console.log('No roles to verify, check your config.json file');
            return foundBuyer;
        }

        if(history == undefined) {
            console.log('No transaction history was found when looking up ' + email);
            return foundBuyer;
        }

        for(var i = 0; i < config.Verify.length; i++) {
            var roleID = config.Verify[i]['discordRoleID'];
            var searchFor = config.Verify[i]['searchFor'].toLowerCase();

            for(var x = 0; x < history.length; x++) {
                if(!history[x].payer_info.email_address == undefined) continue;

                if(history[x].payer_info.email_address == email) {
                    var details = history[x].cart_info.item_details;
                    
                    
                    if(details != undefined) {
                        for(var y = 0; y < details.length; y++) {
                            var subject = details[y].item_name.toLowerCase();
                            if(subject.toLowerCase().includes(searchFor)) {
                                foundBuyer = roleID;
                            }
                        }
                    }
                }
            }
        }

        return foundBuyer;
    }


    thirtyDaysAgo(date) {
        return new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
}