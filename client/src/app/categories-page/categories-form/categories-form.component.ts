import { Category } from './../../shared/interfaces';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { CategoriesService } from '../../shared/services/categories.service';
import { switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { MaterialService } from '../../shared/classes/material.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css'],
})
export class CategoriesFormComponent implements OnInit {
  form: FormGroup;
  isNew = true;
  image: File;
  imagePreview;
  @ViewChild('input')
  inputRef: ElementRef;

  category: Category;

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
    });

    this.form.disable();

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.categoriesService.getById(params['id']);
          }

          return of(null);
        })
      )
      .subscribe(
        (category: Category) => {
          if (category) {
            this.category = category;
            this.form.patchValue({
              name: category.name,
            });
            this.imagePreview = category.imageSrc;
            MaterialService.updateTextInput();
          }
          this.form.enable();
        },
        error => MaterialService.toast(error.error.message)
      );
  }

  triggerClick() {
    this.inputRef.nativeElement.click();
  }

  deleteCategory() {
    const desicion = window.confirm(
      `Вы уверены что хотите удалить категорию ${this.category.name}`
    );

    if (desicion) {
      this.categoriesService.delete(this.category._id).subscribe(
        response => {
          MaterialService.toast(response.message);
        },
        error => {
          MaterialService.toast(error.error.message);
        },
        () => {
          this.router.navigate(['/categories']);
        }
      );
    }
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(file);
  }

  onSubmit() {
    let obs$;
    this.form.disable();
    if (this.isNew) {
      // create
      obs$ = this.categoriesService.create(this.form.value.name, this.image);
    } else {
      // update
      obs$ = this.categoriesService.update(
        this.category._id,
        this.form.value.name,
        this.image
      );
    }

    obs$.subscribe(
      category => {
        this.category = category;
        this.form.enable();
        MaterialService.toast('Изменения Сохранены');
      },
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }
}
