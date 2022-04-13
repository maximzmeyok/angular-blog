import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Post, FbCreateResponse } from './interfaces';
import { map } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class PostsService {
  public constructor(private http: HttpClient) {}

  public create(post: Post): Observable<Post> {
    return this.http.post(`${environment.fbDbUrl}/posts.json`, post)
    .pipe(map((response: FbCreateResponse): Post => {
      return {
        ...post,
        id: response.name,
        date: new Date(post.date)
      }
    }))
  }

  public getAll(): Observable<Post[]> {
    return this.http.get(`${environment.fbDbUrl}/posts.json`)
    .pipe(map((response: {[key: string]: any}): Post[] => {
      return Object
      .keys(response)
      .map((key): Post => ({
        ...response[key],
        id: key,
        date: new Date(response[key].date)
      }))
    }))
  }

  public getById(id: string): Observable<Post> {
    return this.http.get<Post>(`${environment.fbDbUrl}/posts/${id}.json`)
    .pipe(map((post: Post): Post => {
      return {
        ...post,
        id,
        date: new Date(post.date)
      }
    }))
    
  }

  public remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDbUrl}/posts/${id}.json`)
  }

  public update(post: Post): Observable<Post> {
    return this.http.patch<Post>(`${environment.fbDbUrl}/posts/${post.id}.json`, post)
  }
}