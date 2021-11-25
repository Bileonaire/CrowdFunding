import React, { useState } from 'react';
import { Card, Button, Grid } from "semantic-ui-react";
import web3 from '../../ethereum/web3';
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import ContributeForm from '../../components/ContributeForm';


function Camp(props) {
    const { address } = props;
    return (
        <Layout>
            <h3>The Campaign Address - {address}</h3>
            <Grid>
                <Grid.Column width={11}>
                    {renderCampaign(props)}
                </Grid.Column>
                <Grid.Column width={5}>
                    <ContributeForm address={address}/>
                </Grid.Column>
            </Grid>
        </Layout>
  );
}

function renderCampaign(props) {
    const items = [
        {
            header: 'Address of Manager',
            meta: 'The manager created this campaign and is incharge of the project',
            description:  props.manager,
            style: { overflowWrap: 'break-word' }
        },
        {
            header: 'Minimum Contribution',
            meta: 'This is the minimum allowed contribution',
            description:  props.minimumContribution,
            style: { overflowWrap: 'break-word' }
        },
        {
            header: 'Camapign Balance',
            meta: 'This is the total available contribution',
            description:  web3.utils.fromWei(props.balance, 'ether'),
            style: { overflowWrap: 'break-word' }
        },
        {
            header: 'Requests Available',
            meta: 'This are the available spending requests, Requests have to be approved by contributors',
            description:  props.requestsCount,
            style: { overflowWrap: 'break-word' }
        },
        {
            header: 'Total Approvers',
            meta: 'This is the total available contributors',
            description:  props.approversCount,
            style: { overflowWrap: 'break-word' }
        }
    ]
    return <Card.Group items={items} />
}

export const getServerSideProps = async (context) => {
    const campaign = Campaign(context.query.address);
    const address = context.query.address;
    let campaignData = await campaign.methods.getSummary().call();
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

export default Camp;