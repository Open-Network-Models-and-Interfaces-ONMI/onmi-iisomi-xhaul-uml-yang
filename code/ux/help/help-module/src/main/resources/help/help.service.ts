import * as angular from 'angularAMD';

const help = angular.module('app.help');

export interface VersionInfo {
  label: string,
  path: string,
  date: string
}

export interface TocNode {
  label: string; 
  versions: {
    [versionKey: string]: VersionInfo
  };
  nodes?: TocNodeCollection;
}

export type TocNodeCollection = { [tocNodeKey: string]: TocNode };


interface IEnv {
  getBaseURL: (salType: 'AD_SAL' | 'MD_SAL') => string;
}

/** Represents a service used for the help application. */
export interface IHelpService {

  /**
   * Queries the table of contents for a specific version.
   * @param version The version the table of contents shall be requested for.
   * @returns A Promise containing the requested table of contents.
   * 
   */
  getTableOfContents(version?: string): angular.IPromise<TocNodeCollection>;

  /**
   * Get a specitic document by its path.
   * @param path The path of the document to get.
   * @returns A Promise containing the requested document.
   * 
   */
  getDocument(path: string): angular.IPromise<{ basePath: string, document: string }>;
}

class Helpservice implements IHelpService {

  private tocNodeCollection: TocNodeCollection;
  private documents: { [path: string]: { basePath: string, document: string } };

	constructor(private $q: angular.IQService, private $http: angular.IHttpService, private env: IEnv) {
    this.tocNodeCollection = null;
    this.documents = {};
  }
 
  public getTableOfContents(): angular.IPromise<TocNodeCollection> {
    if (this.tocNodeCollection) {
      return this.$q.resolve(this.tocNodeCollection);
		}

		return this.$http({
      method: "GET",
			url: `${this.env.getBaseURL('MD_SAL')}/help/?meta`
    }).then((result: angular.IHttpResponse<TocNodeCollection>) => {
      if (result.status === 200) {
				this.tocNodeCollection = result.data;
				return result.data;
      }
    });
  }

  public getDocument(path: string): angular.IPromise<{basePath: string, document: string}> {
    if (this.documents[path] != null) {
      return this.$q.resolve(this.documents[path]);
    }

   return this.$http({
      method: "GET",
      url: `${this.env.getBaseURL('MD_SAL')}/help/${path}`
    }).then((result: angular.IHttpResponse<string>) => {
      if (result.status === 200) {
        return this.documents[path] = {
          basePath: result.config && result.config.url && result.config.url,
          document: result.data
        };
      }
    });

  } 
}

help.service('helpService', ['$q', '$http', 'ENV',  Helpservice]);