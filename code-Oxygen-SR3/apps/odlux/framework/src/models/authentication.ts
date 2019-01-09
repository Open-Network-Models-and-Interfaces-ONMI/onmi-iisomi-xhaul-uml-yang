import * as JWT from 'jsonwebtoken';  

export interface IUserInfo {
  iss: string,
  iat: number,
  exp: number,
  aud: string,
  sub: string,
  firstName: string,
  lastName: string,
  email: string,
  role: string[]
}


export class User {

  public _userInfo: IUserInfo | null;
  
  constructor(private _bearerToken: string) {
    //const pem = require('raw-loader!../assets/publicKey.pem');
    const pem = "kFfAgpf806IKa4z88EEk6Lim7NMGicrw99OmIB38myM9CS44nEmMNJxnFu3ImViS248wSwkuZ3HvrhsPrA1ZFRNb1a6CEtGN4DaPJbfuo35qMp50tIEpy8nsSFpayOBE";

    try {
      const dec = (JWT.verify(_bearerToken, pem)) as IUserInfo;
      this._userInfo = dec;
    } catch (ex) {
      this._userInfo = null;
    }
  }

  public get user(): string | null {
    return this._userInfo && this._userInfo.email;
  };

  public get roles(): string[] | null {
    return this._userInfo && this._userInfo.role;
  }
  public get token(): string | null {
    return this._userInfo && this._bearerToken;
  }

  public isInRole(role: string | string[]): boolean {
    return false;
  }

}

// key:kFfAgpf806IKa4z88EEk6Lim7NMGicrw99OmIB38myM9CS44nEmMNJxnFu3ImViS248wSwkuZ3HvrhsPrA1ZFRNb1a6CEtGN4DaPJbfuo35qMp50tIEpy8nsSFpayOBE
// token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPRExVWCIsImlhdCI6MTUzODQ2NDMyMCwiZXhwIjoxNTcwMDAwMzIwLCJhdWQiOiJsb2NhbGhvc3QiLCJzdWIiOiJsb2NhbGhvc3QiLCJmaXJzdE5hbWUiOiJNYXgiLCJsYXN0TmFtZSI6Ik11c3Rlcm1hbm4iLCJlbWFpbCI6Im1heEBvZGx1eC5jb20iLCJyb2xlIjpbInVzZXIiLCJhZG1pbiJdfQ.9e5hDi2uxmIXNwHkJoScBZsHBk0jQ8CcZ7YIcZhDtuI