const request = require('request');
const fs = require('fs');
const url = "https://www.intensivregister.de/api/public/intensivregister";
const job = () => {
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if(error){
            console.log(error);
        }
        else {
            if (response.statusCode === 200){
                //console.log(body.data[0]) // Print the json response
                let klinikum = body.data.find(c => c.krankenhausStandort.bezeichnung === 'Universitätsklinikum Mannheim Gmbh, Hauptstandort');
                fs.appendFile('./data/intensivAuslastung.csv',
                    `${klinikum.meldezeitpunkt.split('T')[0]};${klinikum.bettenStatus.statusLowCare};${klinikum.bettenStatus.statusHighCare};${klinikum.bettenStatus.statusECMO}\n`,
                    (err) =>{
                        if(err){
                             console.log(err);
                             return;
                        }
                        console.log('SUCCESS');
                });
            }
            else {
                console.log("statuscode = "+response.statusCode);
            }
        }
    })
}


job();
setInterval(job, 24*60*60*1000);