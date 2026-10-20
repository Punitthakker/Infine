import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

// Makes sure the admin login in ADMIN_EMAIL / ADMIN_PASSWORD works. Creates the user if it
// is missing, otherwise resets its password to ADMIN_PASSWORD. Change the variable in
// Railway and redeploy to change the password.
export default async function ensureAdmin({ container }: ExecArgs) {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD || ""
  if (!email || !password) return console.log("ensure-admin: ADMIN_EMAIL/ADMIN_PASSWORD not set, skipping")
  if (password.includes("${{")) return console.log("ensure-admin: ADMIN_PASSWORD is not a real password yet, skipping")

  const auth = container.resolve(Modules.AUTH)
  const users = container.resolve(Modules.USER)
  let [user] = await users.listUsers({ email })
  if (!user) user = await users.createUsers({ email })

  const [identity] = await auth.listProviderIdentities({ entity_id: email, provider: "emailpass" })
  if (identity) {
    const r = await auth.updateProvider("emailpass", { entity_id: email, password })
    if (!r.success) throw new Error(r.error || "password update failed")
    console.log(`ensure-admin: password reset for ${email}`)
  } else {
    const r = await auth.register("emailpass", { body: { email, password } } as any)
    if (!r.success || !r.authIdentity) throw new Error(r.error || "register failed")
    await auth.updateAuthIdentities({ id: r.authIdentity.id, app_metadata: { user_id: user.id } })
    console.log(`ensure-admin: login created for ${email}`)
  }
}
