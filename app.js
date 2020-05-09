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
                let mannheimKh = body.data.filter(c => c.krankenhausStandort.ort === 'Mannheim');
                for (let kh of mannheimKh){
                    console.log(kh.krankenhausStandort.bezeichnung);
                    fs.appendFile('./data/intensivAuslastung.csv',
                        `${kh.meldezeitpunkt.split('T')[0]};${kh.krankenhausStandort.bezeichnung.split(' ')[0]};${kh.bettenStatus.statusLowCare};${kh.bettenStatus.statusHighCare};${kh.bettenStatus.statusECMO}\n`,
                        (err) =>{
                            if(err){
                                console.log(err);
                                return;
                            }
                            console.log('SUCCESS');
                        });
                }

            }
            else {
                console.log("statuscode = "+response.statusCode);
            }
        }
    })
}


job();
setInterval(job, 24*60*60*1000);