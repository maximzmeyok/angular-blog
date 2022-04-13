import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription, switchMap } from 'rxjs';
import { PostsService } from 'src/app/shared/posts.service';
import { Post } from '../../shared/interfaces';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  public form: FormGroup
  public submitted = false

  private post: Post
  private uSub: Subscription

  public constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private alert: AlertService
  ) { }

  public ngOnInit(): void {
    this.route.params.pipe(
      switchMap((params: Params): Observable<Post> => {
        return this.postsService.getById(params['id'])
      })
    ).subscribe((post: Post): void => {
      this.post = post
      this.form = new FormGroup({
        title: new FormControl(post.title, Validators.required),
        text: new FormControl(post.text, Validators.required)
      })
    })
  }

  public submit(): void {
    if (this.form.invalid) {
      return
    }

    this.submitted = true

    this.uSub = this.postsService.update({
      ...this.post,
      text: this.form.value.text,
      title: this.form.value.title
    }).subscribe((): void => {
      this.submitted = false
      this.alert.warning('Post have been refreshed')
    })
  }

  public ngOnDestroy(): void {
    if (this.uSub) {
      this.uSub.unsubscribe()
    }
  }
}
