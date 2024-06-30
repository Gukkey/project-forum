/* eslint-disable no-unused-vars */
export {}

declare global {
  interface CustomJwtSessionClaims {
    publicMetadata?: {
      role: "member" | "admin"
    }
  }
}
