import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Post } from '../shared/interfaces';
import { PostsService } from '../shared/posts.service';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {

  public post$: Observable<Post>

  public constructor(
    private postsService: PostsService,
    private route: ActivatedRoute
  ) { }

  public ngOnInit(): void {
    this.post$ = this.route.params
    .pipe(switchMap((params: Params): Observable<Post> => {
      return this.postsService.getById(params['id'])
    }))
  }
}
