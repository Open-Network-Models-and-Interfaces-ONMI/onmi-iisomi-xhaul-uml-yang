import * as angular from 'angularAMD';

const security = angular.module('app.security');

interface IEnvService {
  getBaseURL(port: string): string;
}

export type User = {
  description: string;
  domainid: string;
  email: string;
  enabled: boolean;
  password: string;
  salt: string;
  userid: string;
}

export type Role = {
  roleid: string;
  name: string;
  description: string;
  domainid: string;
}

export class SecurityService {
  private credentials: ng.IPromise<string>;

  constructor(private $q: ng.IQService, private $http: ng.IHttpService, private $window, private env: IEnvService) {
    this.ensureCrendentials();
  }

  private ensureCrendentials() {
    const credentialsDefer = this.$q.defer<string>();
    this.credentials = credentialsDefer.promise;

    const url = `${this.env.getBaseURL('MD_SAL')}/oauth2/token`;
    this.$http<{ access_token: string }>({
      method: "POST",
      url: url,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: `grant_type=password&username=${this.$window.sessionStorage.odlUser}&password=${this.$window.sessionStorage.odlPass}&scope=sdn`
    }).then(res => {
      credentialsDefer.resolve(res.data && res.data.access_token);
    }, err => {
      credentialsDefer.reject(err);
    });
  }

  public get token() {
    return this.credentials;
  }

  public getAllUsers(): ng.IPromise<User[]> {
    const url = `${this.env.getBaseURL('MD_SAL')}/auth/v1/users`;
    return this.token.then(token => {
      return this.$http<{ users: User[] }>({
        method: "GET",
        url: url,
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(result => result.data && result.data.users)
    });
  }

  public getAllRoles(): ng.IPromise<Role[]> {
    const url = `${this.env.getBaseURL('MD_SAL')}/auth/v1/roles`;
    return this.token.then(token => {
      return this.$http<{ roles: Role[] }>({
        method: "GET",
        url: url,
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(result => result.data && result.data.roles)
    });
  }

  public getUserById(userId: string): ng.IPromise<User> {
    const url = `${this.env.getBaseURL('MD_SAL')}/auth/v1/users/${userId}`;
    return this.token.then(token => {
      return this.$http<User>({
        method: "GET",
        url: url,
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(result => result.data && result.data)
    });
  }

  public getRolesForDomainUser(userId: string, domain: string= "sdn"): ng.IPromise<Role[]> {
    const url = `${this.env.getBaseURL('MD_SAL')}/auth/v1/domains/${domain}/users/${userId}/roles`;
    return this.token.then(token => {
      return this.$http<{ roles: Role[] }>({
        method: "GET",
        url: url,
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(result => result.data && result.data.roles)
    });
  }
}

security.service('securityService', ['$q', '$http', '$window', 'ENV', SecurityService]);