import { AuthService } from './shared/services/auth.service';
import {Component, OnInit} from '@angular/core'

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService) {

  }
  ngOnInit() {
    const potintialToken = localStorage.getItem('auth-token')
    if (potintialToken !== null) {
      this.auth.setToken(potintialToken)
    }
  }
}
