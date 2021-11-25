import { useRouter } from "next/router";
import { Card, Button } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";
import { Link } from "../routes";

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
            description: (
              <Link route={`/campaigns/${campaign}`}>
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
      <div>
        <h3>Open Campaigns</h3>

        <Link route="/campaigns/new">
          <a>
            <Button
              floated="right"
              content="create Campaign"
              icon="add circle"
              primary
            />
          </a>
        </Link>
        {renderCampaigns()}
      </div>
    </Layout>
  );
}

export async function getStaticProps(context) {
  const campaigns = await factory.methods.getAddresses().call()

  return {
    revalidate: 1,
    props: {
      campaigns,
    },
  };
}

export default Home;