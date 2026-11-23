import nextjs from "@prisma/composer/nextjs";
import { compute } from "@prisma/composer-prisma-cloud";
import { postgres, dataContract } from "@prisma/composer-prisma-cloud/orm";
import { z } from "zod";
import { secretString } from "@prisma/composer/zod";
import konectaContractJson from "./src/prisma/contract.json" with { type: "json" };

export default compute({
  name: "konecta",
  deps: { db: postgres(dataContract(konectaContractJson)) },
  input: z.object({
    nextAuthSecret: secretString(),
    cronSecret: secretString(),
  }),
  build: nextjs({ module: import.meta.url, appDir: "." }),
});
