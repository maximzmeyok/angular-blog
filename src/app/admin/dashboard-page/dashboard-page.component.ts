import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/shared/interfaces';
import { PostsService } from 'src/app/shared/posts.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  public posts: Post[] = [];
  public searchStr: string = '';

  private _pSub: Subscription;
  private _dSub: Subscription;

  constructor(
    private _postService: PostsService,
    private _alertService: AlertService,
  ) {}

  public ngOnInit(): void {
    this._pSub = this._postService.getAll().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  public ngOnDestroy(): void {
    if (this._pSub) {
      this._pSub.unsubscribe();
    }

    if (this._dSub) {
      this._dSub.unsubscribe();
    }
  }

  public remove(id: string): void {
    this._dSub = this._postService.remove(id).subscribe(() => {
      this.posts = this.posts.filter((post) => post.id !== id);
      this._alertService.warning('Пост был удалён');
    });
  }
}
