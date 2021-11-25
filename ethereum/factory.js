import web3 from './web3';
import campaignfactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(campaignfactory.interface),
    '0xeBb6ACBC2b2c134D68ba321d163d67Fb140D05fA'
);

export default instance;