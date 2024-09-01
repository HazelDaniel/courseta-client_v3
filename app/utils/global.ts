export const isPublicRoute: (route: string) => boolean = (route) => {
  const protectedRoutes = ["/students", "/creators"];
  return !!!(protectedRoutes.find(el => route.startsWith(el)));
}
