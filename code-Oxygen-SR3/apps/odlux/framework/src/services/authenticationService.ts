function timeout(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class AuthenticationService {
  public async authenticateUser(email: string, password: string) : Promise<string | null> {
    await timeout(650);
    if (email === "max@odlux.com" && password === "geheim") {
      return "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPRExVWCIsImlhdCI6MTUzODQ2NDMyMCwiZXhwIjoxNTcwMDAwMzIwLCJhdWQiOiJsb2NhbGhvc3QiLCJzdWIiOiJsb2NhbGhvc3QiLCJmaXJzdE5hbWUiOiJNYXgiLCJsYXN0TmFtZSI6Ik11c3Rlcm1hbm4iLCJlbWFpbCI6Im1heEBvZGx1eC5jb20iLCJyb2xlIjpbInVzZXIiLCJhZG1pbiJdfQ.9e5hDi2uxmIXNwHkJoScBZsHBk0jQ8CcZ7YIcZhDtuI"
    }
    return null;
  }
}

export const authenticationService = new AuthenticationService();
export default authenticationService;