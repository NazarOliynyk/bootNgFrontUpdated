import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AccountCredentials} from './AccountCredentials';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  formLogInObj = {
    login: '',
    password: '',
  };
  formRegistrObj = {
    login: '',
    password: '',
  };
  credentials: AccountCredentials = new AccountCredentials();

  headersOption: HttpHeaders;

  responseGet: string;
  responseLogIn: string;
  responseRegistration: string;

  constructor(
    private http: HttpClient
  ) { }


  getInfo() {
     this.headersOption =
   new HttpHeaders({'Authorization': localStorage.getItem('_token')});
      this.http.get('http://localhost:8080/get',
      {headers: this.headersOption, responseType: 'text'}).
    subscribe(value => {console.log(value); this.responseGet = 'Access successful!'; },
      err => this.responseGet = 'Access denied!');
  }

  logInto(formLogin) {
    localStorage.clear();
    console.log(this.formLogInObj.login, ' ', this.formLogInObj.password);
    this.http.post('http://localhost:8080/login',
      JSON.stringify({username: this.formLogInObj.login, password: this.formLogInObj.password}),
      {observe: 'response'}).
    subscribe(
      value => {
      const token = value.headers.get('Authorization');
      const userPassword = value.headers.get('UserLogged');
      const userClass = value.headers.get('UserClass');
      const userStringified = JSON.stringify(value.headers.get('UserLoggedBody'));
      const userLoggedTotal = value.headers.get('UserLoggedTotal');
      const userAuthenticated = value.headers.get('UserAuthenticated');

        localStorage.setItem('_token', token);
       console.log(token);
       console.log(value);
       console.log('userPassword: ' + userPassword);
        console.log('userClass: ' + userClass);
        console.log('UserLoggedBody: ' + userStringified);
        console.log('UserLoggedTotal: ' + userLoggedTotal);
        console.log('UserAuthenticated: ' + userAuthenticated);
        if (userClass.toString() === 'User.class class') {
          console.log('it matches!!');
        } else {console.log('it does not match!'); }
        this.responseLogIn = 'Access successful!'; },
    err => {console.log('err: ' + err.toString());
      this.responseLogIn = 'Access denied!'; }
    );
  }

  // registrate(formRegistr): Observable<AccountCredentials> {
  //   this.credentials.username = this.formRegistrObj.login;
  //   this.credentials.password = this.formRegistrObj.password;
  //   console.log(this.credentials);
  //   return this.http.post<AccountCredentials>('http://localhost:8080/saveUser',
  //     this.credentials, {observe: 'response'}).subscribe(value => console.log(value.password));
  // }

  // statusText from respons works here

  registrate(formRegistr) {
    this.credentials.username = this.formRegistrObj.login;
    this.credentials.password = this.formRegistrObj.password;
    console.log(this.credentials);

     this.http.post<AccountCredentials>('http://localhost:8080/saveUser',
      this.credentials, {observe: 'response'}).
      subscribe(value => {
        this.responseRegistration = 'Server responsed: ' + value.statusText + ' User has been registered!';
        console.log(value.toString()); },
      err => { console.log(err);
        this.responseRegistration = 'Unsuccessful Registration'; }
        );
  }
}
