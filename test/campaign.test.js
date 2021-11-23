const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000'});

    await factory.methods.createCampaign('100', accounts[0]).send({
        from: accounts[0],
        gas: '1000000'
    });

    [campaignAddress] = await factory.methods.getAddresses().call();
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('Campaigns', () => {
    it('deployes a factory and campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('manager is creator', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('contibutor added as approver', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '200'
        });
        const approver = await campaign.methods.approvers(accounts[1]).call();
        assert(approver);
    });

    it('minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '10'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('manager creates request', async () => {
        await campaign.methods.createrequest('messi', '10', accounts[3]).send({
            from: accounts[0],
            gas: '1000000'
        });
        const requests = await campaign.methods.requests(0).call();
        assert(!requests.complete);
    });

    it('end to end test', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods
            .createrequest('messi', web3.utils.toWei('5', 'ether'), accounts[3])
            .send({
                from: accounts[0],
                gas: '1000000'
        });

        await campaign.methods
            .approveRequest(0)
            .send({
                from: accounts[1],
                gas: '1000000'
        });

        let balanceBefore = await web3.eth.getBalance(accounts[3]);
        balanceBefore = web3.utils.fromWei(balanceBefore, 'ether');
        balanceBefore = parseFloat(balanceBefore);

        await campaign.methods
            .finalizeRequest(0)
            .send({
                from: accounts[0],
                gas: '1000000'
        });

        const requests = await campaign.methods.requests(0).call();
        assert(requests.complete);

        let balanceAfter = await web3.eth.getBalance(accounts[3]);
        balanceAfter = web3.utils.fromWei(balanceAfter, 'ether');
        balanceAfter = parseFloat(balanceAfter);

        assert(balanceAfter > balanceBefore);
    });
});
