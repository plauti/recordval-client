import "dotenv/config";
import { createRvClient } from "./index.js";

const orgId = String(process.env.ORG_ID);
const publicKey = String(process.env.PUBLIC_KEY);
const privateKey = String(process.env.PRIVATE_KEY);
const baseUrl = String(process.env.BASE_URL);

const client = createRvClient(orgId, publicKey, privateKey, baseUrl);

const main = async () => {
  const response = await client.fetchMyCredits();
  console.log(`Credits for ${orgId}`);
  response.json().then(console.log);
};

main();
