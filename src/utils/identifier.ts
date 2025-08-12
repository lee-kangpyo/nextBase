export function getUserIdentifier(user: any): string {
  return user.userName || '';
}

export function getSessionIdentifier(session: any): string {
  return session?.user?.userName || '';
}
