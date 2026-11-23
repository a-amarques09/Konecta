import { module } from "@prisma/composer";
import { envSecret } from "@prisma/composer-prisma-cloud";
import { postgres, dataContract } from "@prisma/composer-prisma-cloud/orm";
import konectaContractJson from "./src/prisma/contract.json" with { type: "json" };
import konectaService from "./service.mjs";

export default module("prisma-postgres-indigo-pocket", ({ provision }) => {
  const database = provision(
    postgres({
      name: "database",
      contract: dataContract(konectaContractJson),
      config: "./prisma.config.ts",
    })
  );
  provision(konectaService, {
    deps: { db: database },
    input: {
      nextAuthSecret: envSecret("NEXTAUTH_SECRET"), // Signs NextAuth session JWTs.
      cronSecret: envSecret("CRON_SECRET"), // Authorizes the /api/cron/cleanup endpoint.
    },
  });
});
