import { IAuthor } from '../models/author';

import * as $ from 'jquery';

const base_url = 'https://api.mfico.de/v1/authors';

/** 
 * Represents a web api accessor service for all author related actions.
 */
class AuthorService {

 /**
   * Gets all known authors from the backend.
   * @returns A promise of the type array of @see {@link IAuthor} containing all known authors.
   */
  public getAllAuthors(): Promise<IAuthor[]> {
    return new Promise((resolve: (value: IAuthor[]) => void, reject: (err: any) => void) => {
      $.ajax({ method: "GET", url: base_url })
        .then((data) => { resolve(data); }, (err) => { reject(err) });
    });
  }

 /**
   * Gets an author by its id from the backend.
   * @returns A promise of the type @see {@link IAuthor} containing the author to get.
   */
  public getAuthorById(id: string | number): Promise<IAuthor> {
    return new Promise((resolve: (value: IAuthor) => void, reject: (err: any) => void) => {
      $.ajax({ method: "GET", url: base_url + "/" + id })
        .then((data) => { resolve(data); }, (err) => { reject(err) });
    });
  }


/**
 * Saves the given author to the backend api.
 * @returns A promise of the type @see {@link IAuthor} containing the autor returned by the backend api.
 */
  public saveAuthor(author: IAuthor): Promise<IAuthor> {
    return new Promise((resolve: (value: IAuthor) => void, reject: (err: any) => void) => {
       // simulate server save
      window.setTimeout(() => {
        if (Math.random() > 0.8) {
          reject("Could not save author.");
        } else {
          resolve(author);
        }
      }, 800); // simulate a short network delay
    });
  }
}

// return as a singleton
export const authorService = new AuthorService();
export default authorService;
