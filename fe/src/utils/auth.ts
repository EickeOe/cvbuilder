export default function () {}
export const isGlobalAdmin = () => {}
export const isProductAdmin = (user: any, product: MicroApp) => {
  if (!user.roles) {
    return false
  }
  return user.roles.some((role: any) => role.roleCode === product.key)
}
