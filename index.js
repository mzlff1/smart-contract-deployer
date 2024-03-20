const Web3 = require('web3');

/**
 * Deploys a smart contract to an Ethereum network.
 * @param {string} providerURL - The URL of the Ethereum node.
 * @param {string} privateKey - The private key of the deployer account.
 * @param {Object} contractABI - The ABI of the contract to deploy.
 * @param {string} contractBytecode - The bytecode of the contract to deploy.
 * @param {Array} constructorArgs - The arguments for the contract's constructor.
 * @returns {Promise<string>} - The address of the deployed contract.
 */
async function deployContract(providerURL, privateKey, contractABI, contractBytecode, constructorArgs = []) {
    const web3 = new Web3(providerURL);
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;

    const contract = new web3.eth.Contract(contractABI);
    const deployOptions = {
        data: '0x' + contractBytecode,
        arguments: constructorArgs,
    };

    const gasEstimate = await contract.deploy(deployOptions).estimateGas({ from: account.address });

    const deployedContract = await contract.deploy(deployOptions)
        .send({
            from: account.address,
            gas: gasEstimate,
        });

    return deployedContract.options.address;
}

module.exports = deployContract;