import  Web3 from "web3";
import express from "express";
import ContractABI from "../assets/ContractABI.json";
import { TOKEN_CONTRACT_ADDRESS, RPC_URl, START_BLOCK_OFFSET, END_BLOCK_OFFSET, ITERATIONS, PORT } from "../config/config.js";
 
const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URl));
const contract = new web3.eth.Contract(ContractABI,TOKEN_CONTRACT_ADDRESS);

const app = express();

let adminPvtKey = ''
let address = '';
let Result = [];

// get allowances of all approved addresses for a given address
// eg address for testing: 0x415198d909d35b4bCe2f2de87EDaDa39720A5A68
async function AllowanceApi(address) {

    let eventlist = [];
    let result = {};
    var start = START_BLOCK_OFFSET;
    var end = END_BLOCK_OFFSET;
    
    for (var j = 0, l = ITERATIONS; j<l; j++ ){
        let events = await contract.getPastEvents("Approval",
            {   filter: {owner:address},                   
                fromBlock: start,     
                toBlock: end          
            })
        
        for (var i = 0, l = events.length; i < l; i++) 
        {
            eventlist.push([result['spender'] = events[i]['returnValues']['spender'],result['value'] = events[i]['returnValues']['value']]);
        }

        start = start - 3000;
        end = end - 3000
    }

    return eventlist;
}                      

// update allowances of all approved addresses to 0 for a given address
async function UpdateAllowance(){

    var allowanceAddresses = [];
    var txObj;

    for (var i = 0, l = Result.length; i < l; i++) 
    {
        if(Result[i][1] != 0){
        allowanceAddresses.push((Result[i][0]));
        }
    }
    var aa = new Set(allowanceAddresses);

    for(let item of aa) {
        if(item) {
            txObj = await createTxObject(item);
            signAndSend(txObj);
        } 
    }
}

// create the transaction object
async function createTxObject(toAddress){

    const nonce = await web3.eth.getTransactionCount(address, 'pending');
    const extraData = await contract.methods.approve(toAddress, 0);
    const data = extraData.encodeABI();
    const txObj = {
        from: address,
        to: TOKEN_CONTRACT_ADDRESS,
        gasPrice: "0x04e3b29200",
        gasLimit: "0x7458",
        data,
        value: '0',
        nonce
    };

    return txObj;
}

// sign and send the transaction
async function signAndSend(txObj){
    const signPromise = web3.eth.accounts.signTransaction(txObj,adminPvtKey);
    signPromise.then((signedTx) => {
     
        const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
        sentTx.on("receipt", receipt => {
            document.write("Transaction sucessfull.");
        });
        sentTx.on("error", err => {
            document.write(err.message);
        });
      }).catch((err) => {
        document.write(err);
      });
}

// getAllowances API
// Takes address as parameter
app.get('/getAllowances/:address', async (req, res) => {
    address = req.params.address;
    Result = await getAllowance();
    document.write(Result)
})

// updateAllowances API
// Takes private key of initially given address as parameter
app.get('/updateAllowances/:adminPvtKey', (req, res) => {
    adminPvtKey = req.params.adminPvtKey;
    UpdateAllowance()
})

// Start listenting on specified port
app.listen(PORT, () => {
console.log(`app listening on port ${PORT}`)
})

