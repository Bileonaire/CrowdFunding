import React, { useState } from 'react';
import { Card, Button, Grid } from "semantic-ui-react";
import web3 from '../../../ethereum/web3';
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";
import { Link } from '../../../routes';


function Requests({ address, requests }) {
    function renderRequests() {
        const ref = requests.map((request) => {
            return {
                header: request,
                description: (
                <Link route={'/'}>
                    <a>View Campaign</a>
                </Link>
                ),
                fluid: true
            };
        });
        return <Card.Group items={ref} />
    }
        return (
            <Layout>
                <h3>Requests</h3>
                <Link route={`/campaigns/${address}/requests/new`}>
                    <a>
                        <Button primary>Add Requests</Button>
                    </a>
                </Link>
                {renderRequests()}
            </Layout>
    );
}

export const getServerSideProps = async (context) => {
    const address = context.query.address;
    const campaign = Campaign(context.query.address);

    const requestsCount  = await campaign.methods.getRequestsCount().call();

    const requests  = await Promise.all(
        Array(parseInt(requestsCount)).fill().map((element, index) => {
            return campaign.methods.requests(index).call()
        })
    );

    console.log(requests);
    return {
    props: {
        address,
        requests,
        requestsCount,
    },
  };
}

export default Requests;