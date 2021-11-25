import web3 from './web3';
import campaignfactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(campaignfactory.interface),
    '0x059A789DB01Ddf5E5B2805A6D3C254c5E28d8Bb3'
);

export default instance;