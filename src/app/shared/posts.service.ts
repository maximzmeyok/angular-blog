import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { FbCreateResponse, Post } from "./interfaces";

@Injectable({providedIn: 'root'})
export class PostsService {
  constructor(private _http: HttpClient) { }

  public create(post: Post): Observable<Post> {
    return this._http.post(`${environment.fbDbUrl}/posts.json`, post)
      .pipe(
        map((response: FbCreateResponse) => {
          return {
            ...post,
            id: response.name,
            date: new Date(post.date),
          }
        }),
      );
  }

  public getAll(): Observable<Post[]> {
    return this._http.get(`${environment.fbDbUrl}/posts.json`)
      .pipe(
        map((response: {[key: string]: any}) => {
          return Object
          .keys(response)
          .map((key) => ({
            ...response[key],
            id: key,
            date: new Date(response[key].date),
          }));
        }));
  }

  public getById(id: string): Observable<Post> {
    return this._http.get<Post>(`${environment.fbDbUrl}/posts/${id}.json`)
      .pipe(
        map((post: Post) => {
          return {
            ...post,
            id,
            date: new Date(post.date),
          }
        }),
      );
  }

  public remove(id: string): Observable<void> {
    return this._http.delete<void>(`${environment.fbDbUrl}/posts/${id}.json`);
  }

  public update(post: Post): Observable<Post> {
    return this._http.patch<Post>(`${environment.fbDbUrl}/posts/${post.id}.json`, post);
  }
}