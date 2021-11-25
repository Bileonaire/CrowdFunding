import React, { useState } from 'react';
import Layout from "../../components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

const New = () => {
    const [contribution, setContribution] = useState('');
    const [errorMessage, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const newCampaign = async (event) => {
        event.preventDefault();

        try {
            setError('');
            setLoading(true);
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(contribution, accounts[0])
                .send({ from: accounts[0] });
            Router.pushRoute('/');
        } catch (err) {
            setError(err.message)
        }
        setLoading(false)
    };

    return (
        <Layout>
        <div>
            <h3>Open Campaigns</h3>
            <Form onSubmit={newCampaign} error={!!errorMessage}>
                <Form.Field>
                <label>Minimum Contribution</label>
                <Input
                    label='wei'
                    labelPosition='right'
                    placeholder='100'
                    value={contribution}
                    onChange={(e) => setContribution(e.target.value)} />
                </Form.Field>
                <Message error header="Ooops!" content={errorMessage} />
                <Button loading={loading} primary type='submit' >Create!</Button>
            </Form>
        </div>
        </Layout>
  );
}

export default New;