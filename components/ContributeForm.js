import React, { useState } from 'react';
import { Form, Input , Message, Button } from "semantic-ui-react";
import web3 from '../ethereum/web3';
import Campaign from "../ethereum/campaign";
import { Router } from '../routes';

const ContributeForm = ({ address }) => {
    const [contribution, setContribution] = useState('');
    const [errorMessage, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const newContribution = async (event) => {
        event.preventDefault();

        try {
            setError('');
            setLoading(true);
            const accounts = await web3.eth.getAccounts();
            const campaign = Campaign(address);

            await campaign.methods.contribute()
                .send({ from: accounts[0], value: web3.utils.toWei(contribution, 'ether') });
            Router.replaceRoute(`/campaigns/${address}`);
        } catch (err) {
            setError(err.message)
        }
        setLoading(false)
    };

    return(
        <Form onSubmit={newContribution} error={!!errorMessage}>
            <Form.Field>
                <label>Amount to Contribute</label>
                <Input
                    label='ether'
                    labelPosition='right'
                    placeholder='100'
                    value={contribution}
                    onChange={(e) => setContribution(e.target.value)} />
            </Form.Field>
            <Message error header="Ooops!" content={errorMessage} />
            <Button loading={loading} primary type='submit' >Contribute!</Button>
        </Form>
    )
};

export default ContributeForm;