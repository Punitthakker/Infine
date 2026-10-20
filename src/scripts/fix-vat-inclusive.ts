// One-off: mark AED prices as VAT inclusive on an already-seeded database.
import { MedusaContainer } from "@medusajs/framework";
import { setVatInclusive } from "./seed-infine";
export default async function ({ container }: { container: MedusaContainer }) { await setVatInclusive(container); }
