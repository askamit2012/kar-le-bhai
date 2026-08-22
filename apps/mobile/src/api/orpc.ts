import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { ContractRouterClient } from "@orpc/contract";

import type { AppContract } from "@kar-le-bhai/api-contract";

const apiUrl = "http://10.0.2.2:8787/rpc";
const link = new RPCLink({ url: apiUrl, headers: async () => ({}) });

export const orpc: ContractRouterClient<AppContract> = createORPCClient(link);
