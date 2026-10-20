// infine. initial data. Run once on a fresh database:  npx medusa exec ./src/scripts/seed-infine.ts
// Sets up the UAE store (AED, 5% VAT included in prices), Dubai stock location,
// UAE + GCC delivery options, the drops as collections, the categories, the
// MAINCHARACTER promo and every infine.world piece with its sizes, metals and lengths.
// Each piece has ONE shared inventory item, so its edition count is shared by all variants.
import { MedusaContainer } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryItemsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createPromotionsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateSalesChannelsWorkflow,
  updateStoresWorkflow,
  createPricePreferencesWorkflow,
  updatePricePreferencesWorkflow,
} from "@medusajs/medusa/core-flows";
import { CATALOGUE } from "./infine-catalogue";

const SITE = process.env.STOREFRONT_URL || "https://infine.world";
const UAE = ["ae"];
const GCC = ["sa", "qa", "kw", "bh", "om"];

export default async function initial_data_seed({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillment = container.resolve(ModuleRegistrationName.FULFILLMENT);

  const { data: existing } = await query.graph({ entity: "product", fields: ["id"], pagination: { take: 1 } as any });
  if (existing.length) { logger.info("infine: products already exist, seed skipped."); return; }

  logger.info("infine: store, sales channel and publishable key...");
  // Medusa creates a default store, sales channel and key on first boot; reuse them if present.
  const { data: channels } = await query.graph({ entity: "sales_channel", fields: ["id", "name"] });
  let channel: any = channels[0];
  if (channel) {
    await updateSalesChannelsWorkflow(container).run({ input: { selector: { id: channel.id }, update: { name: "infine.world", description: "Gen Z drop site" } } });
  } else {
    ({ result: [channel] } = await createSalesChannelsWorkflow(container).run({ input: { salesChannelsData: [{ name: "infine.world", description: "Gen Z drop site" }] } }));
  }
  const { data: keys } = await query.graph({ entity: "api_key", fields: ["id", "token", "type"], filters: { type: "publishable" } as any });
  let pk: any = keys[0];
  if (!pk) ({ result: [pk] } = await createApiKeysWorkflow(container).run({ input: { api_keys: [{ title: "infine.world storefront", type: "publishable", created_by: "" }] } }));
  await linkSalesChannelsToApiKeyWorkflow(container).run({ input: { id: pk.id, add: [channel.id] } }).catch(() => {});
  const { data: stores } = await query.graph({ entity: "store", fields: ["id"] });
  const storeData = { name: "infine.", supported_currencies: [{ currency_code: "aed", is_default: true }], default_sales_channel_id: channel.id };
  if (stores[0]) await updateStoresWorkflow(container).run({ input: { selector: { id: stores[0].id }, update: storeData } as any });
  else await createStoresWorkflow(container).run({ input: { stores: [storeData] } });

  logger.info("infine: region (AED, VAT inclusive) and tax...");
  const { result: [region] } = await createRegionsWorkflow(container).run({
    input: { regions: [{ name: "UAE & GCC", currency_code: "aed", countries: [...UAE, ...GCC], payment_providers: ["pp_system_default"], is_tax_inclusive: true, automatic_taxes: true } as any] },
  });
  await createTaxRegionsWorkflow(container).run({
    input: [
      { country_code: "ae", provider_id: "tp_system", default_tax_rate: { rate: 5, code: "VAT", name: "UAE VAT" } } as any,
      ...GCC.map((country_code) => ({ country_code, provider_id: "tp_system" })),
    ],
  });

  logger.info("infine: Dubai stock location and delivery...");
  const { result: [location] } = await createStockLocationsWorkflow(container).run({
    input: { locations: [{ name: "Dubai studio", address: { city: "Dubai", country_code: "AE", address_1: "" } }] },
  });
  await link.create({ [Modules.STOCK_LOCATION]: { stock_location_id: location.id }, [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" } });
  const { data: [profile] } = await query.graph({ entity: "shipping_profile", fields: ["id"] });
  const set = await fulfillment.createFulfillmentSets({
    name: "Dubai studio delivery",
    type: "shipping",
    service_zones: [
      { name: "UAE", geo_zones: UAE.map((country_code) => ({ country_code, type: "country" as const })) },
      { name: "GCC", geo_zones: GCC.map((country_code) => ({ country_code, type: "country" as const })) },
    ],
  });
  await link.create({ [Modules.STOCK_LOCATION]: { stock_location_id: location.id }, [Modules.FULFILLMENT]: { fulfillment_set_id: set.id } });
  const zone = (n: string) => set.service_zones.find((z) => z.name === n)!.id;
  const rules = [
    { attribute: "enabled_in_store", value: "true", operator: "eq" as const },
    { attribute: "is_return", value: "false", operator: "eq" as const },
  ];
  const option = (name: string, code: string, description: string, zoneName: string, amount: number) => ({
    name, price_type: "flat" as const, provider_id: "manual_manual", service_zone_id: zone(zoneName), shipping_profile_id: profile.id,
    type: { label: name, description, code }, prices: [{ currency_code: "aed", amount }, { region_id: region.id, amount }], rules,
  });
  await createShippingOptionsWorkflow(container).run({
    input: [
      option("Same day Dubai", "same-day-dubai", "Order before 2pm. Insured, signed for.", "UAE", 0),
      option("UAE 1-2 days", "uae-1-2-days", "Insured, signed for.", "UAE", 0),
      option("GCC express", "gcc-express", "3-5 days. Duties shown at payment.", "GCC", 75),
    ],
  });
  await linkSalesChannelsToStockLocationWorkflow(container).run({ input: { id: location.id, add: [channel.id] } });

  logger.info("infine: drops and categories...");
  const { result: collections } = await createCollectionsWorkflow(container).run({
    input: { collections: CATALOGUE.drops.map((d) => ({ title: `drop ${d.no} · ${d.name}`, handle: d.id, metadata: { opens: d.opens, closes: d.closes, line: d.line } })) },
  });
  const { result: categories } = await createProductCategoriesWorkflow(container).run({
    input: { product_categories: CATALOGUE.categories.filter((c) => c.id !== "all").map((c) => ({ name: c.label, handle: c.id, is_active: true })) },
  });

  logger.info("infine: edition stock...");
  const { result: items } = await createInventoryItemsWorkflow(container).run({
    input: { items: CATALOGUE.products.map((p) => ({ sku: `INF-${p.slug}`, title: p.name, requires_shipping: true, location_levels: [{ location_id: location.id, stocked_quantity: p.left }] })) as any },
  });
  const stockFor = (slug: string) => items.find((i: any) => i.sku === `INF-${slug}`)!.id;

  logger.info("infine: products...");
  const img = (name?: string) => (name ? `${SITE}/assets/img/${name}.webp` : undefined);
  await createProductsWorkflow(container).run({
    input: {
      products: CATALOGUE.products.map((p: any) => {
        const pics = [p.img || p.video, ...(p.gallery || []).map((g: any) => g.img)].filter(Boolean).map((n: string) => ({ url: img(n)! }));
        const variants: any[] = [];
        for (const s of p.sizes) for (const m of p.metals) for (const l of p.lengths) {
          variants.push({
            title: `${s.label} / ${m} / ${l}`,
            sku: `INF-${p.slug}-${variants.length + 1}`,
            options: { Size: s.label, Metal: m, Length: l },
            manage_inventory: true,
            inventory_items: [{ inventory_item_id: stockFor(p.slug), required_quantity: 1 }],
            prices: [{ currency_code: "aed", amount: s.price }],
            metadata: { stones: s.stones },
          });
        }
        return {
          title: p.name,
          handle: p.slug,
          subtitle: p.type,
          description: p.blurb,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: profile.id,
          collection_id: collections.find((c) => c.handle === p.drop)?.id,
          category_ids: [categories.find((c) => c.handle === p.cat)?.id].filter(Boolean) as string[],
          thumbnail: pics[0]?.url,
          images: pics,
          options: [
            { title: "Size", values: p.sizes.map((s: any) => s.label), is_exclusive: true },
            { title: "Metal", values: [...p.metals], is_exclusive: true },
            { title: "Length", values: [...p.lengths], is_exclusive: true },
          ],
          variants,
          sales_channels: [{ id: channel.id }],
          metadata: { edition: p.edition, specs: p.specs, tags: p.tags || [], bg: p.bg || "" },
        };
      }),
    },
  });

  logger.info("infine: promo codes...");
  await createPromotionsWorkflow(container).run({
    input: {
      promotionsData: Object.entries(CATALOGUE.promos).map(([code, rate]) => ({
        code, type: "standard", status: "active", is_automatic: false,
        application_method: { type: "percentage", target_type: "items", allocation: "across", value: Math.round((rate as number) * 100), currency_code: "aed" },
      })) as any,
    },
  });

  await setVatInclusive(container);
  logger.info(`infine: done. Publishable key for config.js: ${pk.token}`);
}

// infine prices already include 5% UAE VAT: tell Medusa so it doesn't add VAT on top.
export async function setVatInclusive(container: MedusaContainer) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({ entity: "price_preference", fields: ["id", "attribute", "value"], filters: { attribute: "currency_code", value: "aed" } as any });
  if (data[0]) await updatePricePreferencesWorkflow(container).run({ input: { selector: { id: data[0].id }, update: { is_tax_inclusive: true } } as any });
  else await createPricePreferencesWorkflow(container).run({ input: [{ attribute: "currency_code", value: "aed", is_tax_inclusive: true }] as any });
}
