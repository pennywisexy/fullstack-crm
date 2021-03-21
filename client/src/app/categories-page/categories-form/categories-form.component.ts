import { error } from 'selenium-webdriver';
import { Category } from './../../shared/interfaces';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { CategoriesService } from 'src/app/shared/services/categories.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input') inputRef?: ElementRef

  isNew = true
  form: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required])
  })
  image?: File
  imagePreview?: string | ArrayBuffer | null
  category?: Category

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.form.disable()

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false
            return this.categoriesService.getById(params['id'])
          }

          return of(null)
        })
      )
      .subscribe(
        (category) => {
          if (category) {
            this.category = category
            this.form.patchValue({
              name: category.name
            })
            this.imagePreview = category.imageSrc
            MaterialService.updateTextInputs()
          }
          this.form.enable()
        },
        error => MaterialService.toast(error.error.message)
      )
  }

  triggerClick() {
    this.inputRef?.nativeElement.click()
  }

  deleteCategory() {
    const decision = window.confirm(`Выуверены что хотите удалить категорию ${this.category?.name}`)

    if (decision) {
      this.categoriesService.delete(this.category?._id as string)
        .subscribe(
          response => MaterialService.toast(response.message as string),
          error => MaterialService.toast(error.error.message),
          () => this.router.navigate(['/categories'])
        )
    }
  }

  onFileUpload(event: any) {
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()

    reader.onload = () => {
      this.imagePreview = reader.result
    }

    reader.readAsDataURL(file)
  }

  onSubmit() {
    let obs$
    this.form.disable()

    this.isNew ? 
      obs$ = this.categoriesService.create(this.form.value.name, this.image) : 
      obs$ = this.categoriesService.update(this.category?._id as string, this.form.value.name, this.image)

    obs$.subscribe(
      category => {
        this.category = category
        MaterialService.toast('Changes saved')
        this.form.enable()

      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }

}
