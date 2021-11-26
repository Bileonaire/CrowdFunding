import React, { useState } from 'react';
import { Button, Form, Input, Message } from "semantic-ui-react";
import web3 from '../../../ethereum/web3';
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";
import { Router } from '../../../routes';


function NewRequests( props ) {
    const [value, setValue] = useState('');
    const [description, setDescription] = useState('');
    const [recipient, setRecipient] = useState('');

    const [errorMessage, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const newRequest = async (event) => {
        event.preventDefault();

        try {
            setError('');
            setLoading(true);
            const accounts = await web3.eth.getAccounts();
            const campaign = Campaign(props.address);

            if(props.manager !== accounts[0]) throw "You are not the manager";

            await campaign.methods.createrequest(description, web3.utils.toWei(value, 'ether'), recipient)
                .send({ from: accounts[0] });
            Router.pushRoute(`/campaigns/${address}/requests`);
        } catch (err) {
            setError(err.message)
        }
        setLoading(false)
    };

    return (
        <Layout>
            <h3>New Request</h3>
            <Form onSubmit={newRequest} error={!!errorMessage}>
                <Form.Field>
                    <label>Description</label>
                    <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>Value</label>
                    <Input
                        label='ether'
                        labelPosition='right'
                        value={value}
                        onChange={(e) => setValue(e.target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>recipient Address</label>
                    <Input
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)} />
                </Form.Field>
                <Message error header="Ooops!" content={errorMessage} />
                <Button loading={loading} primary type='submit' >Create Request!</Button>
            </Form>
        </Layout>
  );
}

export const getServerSideProps = async (context) => {
    const campaign = Campaign(context.query.address);
    let campaignData = await campaign.methods.getSummary().call();
    const address = context.query.address;
    return {
    props: {
        address,
        minimumContribution: campaignData[0],
        balance: campaignData[1],
        requestsCount: campaignData[2],
        approversCount: campaignData[3],
        manager: campaignData[4],
    },
  };
}

export default NewRequests;