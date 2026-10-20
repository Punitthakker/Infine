import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

// Prints the storefront's publishable key to the log. This key is public by design:
// it ships inside the website's JavaScript.
export default async function printKey({ container }: ExecArgs) {
  const keys = await container.resolve(Modules.API_KEY).listApiKeys({ type: "publishable" })
  for (const k of keys) console.log(`INFINE_PUBLISHABLE_KEY ${k.title}: ${k.token}`)
}
