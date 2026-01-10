const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require('fs');
const csv = require('csv-parser');
const results = [];

router.get('/ping', (req, res) => {
    const url ="https://api.enterpret.com/webhook/custom/all";

    console.log("Ping received at /api/test/ping");

    let conversationData = "Data Export - Converstions.csv";
    let actorData = "Data Export - Actor Info.csv";
    let metadata = "Data Export - Metadata.csv";

    fs.createReadStream('Data Export - Converstions.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        // console.log(results);
        conversationData = results;
    });

    fs.createReadStream('Data Export - Actor Info.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        // console.log(results);
        actorData = results;
    });

    fs.createReadStream('Data Export - Metadata.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        // console.log(results);
        metadata = results;
    });

    let conLeng = conversationData.length; 

    for(let i=0;i<conLeng;i+=100){
        let records = [];
        for (let j=i;j<i+100;j++){
            
            //function to get actor infor for this ticket id
            //function to get meta data for this ticket id
            let record = {
                id : conversationData[i].TicketID,
                fileID : "support-chats",
                type : "CONVERSATION",
                createdAt : Date.now(), 
            }
            records.push(record);
        }

        setTimeout(() => {
            axios.post(url, {
                records: records,
            },100)
            .then(response => {
                console.log("Data successfully sent to Enterpret API:", response.data);
            })
            .catch(error => {
                console.error("Error sending data to Enterpret API:", error);
            });
        });
    }
});

module.exports = router;





//  /api/customers/deleteCustomer/:id
