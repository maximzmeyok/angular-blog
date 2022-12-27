import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Post } from 'src/app/shared/interfaces';
import { PostsService } from 'src/app/shared/posts.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public post: Post;
  public submitted: boolean = false;

  private _uSub: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _postService: PostsService
  ) {}

  public ngOnInit(): void {
    this._route.params.pipe(
      switchMap((params: Params) => {
        return this._postService.getById(params['id']);
      }),
    ).subscribe((post: Post) => {
      this.post = post;
      this.form = new FormGroup({
        title: new FormControl(post.title, Validators.required),
        text: new FormControl(post.text, Validators.required),
      });
    });
  }

  public ngOnDestroy(): void {
    if (!this._uSub) {
      return;
    }

    this._uSub.unsubscribe();
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;

    this._uSub = this._postService.update({
      ...this.post,
      text: this.form.value.text,
      title: this.form.value.title,
    }).subscribe(() => {
      this.submitted = false;
    });
  }
}
