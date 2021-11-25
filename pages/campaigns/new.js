import React, { useState } from 'react';
import Layout from "../../components/Layout";
import { Form, Button, Input } from "semantic-ui-react";
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

function New() {
    const [contribution, setContribution] = useState('');

    const newCampaign = async (event) => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        await factory.methods.createCampaign(contribution, accounts[0] ).send({
            from: accounts[0]
        });
    };

    return (
        <Layout>
        <div>
            <h3>Open Campaigns</h3>
            <Form onSubmit={newCampaign}>
                <Form.Field>
                <label>Minimum Contribution</label>
                <Input
                    label='wei'
                    labelPosition='right'
                    placeholder='100'
                    value={contribution}
                    onChange={(e) => setContribution(e.target.value)} />
                </Form.Field>
                <Button primary type='submit' >Create!</Button>
            </Form>
        </div>
        </Layout>
  );
}

export default New;