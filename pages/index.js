import { useRouter } from "next/router";
import { Card, Button } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";

function Home({ campaigns = [] }) {
  const router = useRouter();
  const { isFallback } = router;

  if (isFallback) {
    return <div>Loading...</div>;
  }

  function renderCampaigns() {
    const ref = campaigns.map((campaign) => {
        return {
            header: campaign,
            description: <a>View Campaign</a>,
            fluid: true
        };
    });
    return <Card.Group items={ref} />
  }

  return (
    <Layout>
      <div>
        <h3>Open Campaigns</h3>
        <Button
          floated="right"
          content="create Campaign"
          icon="add circle"
          primary
        />
        {renderCampaigns()}
      </div>
    </Layout>
  );
}

export async function getStaticProps(context) {
  const campaigns = await factory.methods.getAddresses().call()
  console.log(campaigns);

  return {
    revalidate: 1,
    props: {
      campaigns,
    },
  };
}

export default Home;

// -----option2--------
// import React, { useState, useEffect } from "react";
// import factory from "../ethereum/factory";

// function CampaignIndex({ campaigns }) {
//   console.log("campaigns", campaigns);

//   return <h1>{campaigns[0]}</h1>;
// }

// //uses server side rendering to call the campaign contracts (so good for slow devices)
// CampaignIndex.getInitialProps = async () => {
//   const campaigns = await await factory.methods.getAddresses().call();
//   return { campaigns };
// };

// export default CampaignIndex;