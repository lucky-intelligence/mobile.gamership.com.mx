import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

import fs from "fs";

const region = process.env.AWS_REGION || "us-east-1";
const secretId = process.env.AWS_SECRET;

if (!secretId) {
    throw new Error("AWS_SECRET is not set — provide the Secrets Manager secret name or ARN.");
}

const client = new SecretsManagerClient({ region });

console.log(`Loading secrets from AWS Secrets Manager: "${secretId}" (${region})...`);

let response;
try {
    response = await client.send(new GetSecretValueCommand({ SecretId: secretId }));
} catch (err) {
    throw new Error(
        `Failed to fetch secret "${secretId}" in region ${region}: ${err.name}: ${err.message}\n` +
        `Check that AWS_SECRET matches an existing secret, AWS_REGION is correct, and the ` +
        `container's AWS credentials can read it (secretsmanager:GetSecretValue).`
    );
}

const raw = response.SecretString;
if (!raw) {
    throw new Error("Failed to load secrets: empty secret string");
}

const secret = JSON.parse(raw);

fs.writeFileSync(".env", Object.entries(secret).map(([key, value]) => `${key}=${value}`).join("\n"), "utf-8");
