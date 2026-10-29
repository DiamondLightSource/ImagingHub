const tokenItemName = "KEYCLOAK.TOKEN";

export function updateTokenStore(token: string) {
  sessionStorage.setItem(tokenItemName, token);
}

export function readTokenStore(): string {
  const token = sessionStorage.getItem(tokenItemName) ?? "";
  if (token === "") {
    console.error("Auth token is empty");
  }
  return token;
}
