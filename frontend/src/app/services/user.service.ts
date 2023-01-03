import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Configuration } from '../utils/config'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  URI = `http://${Configuration.BACKEND_HOST}:${Configuration.BACKEND_PORT}/${Configuration.BACKEND_USER_ROUTES}`

  login(username, password) {
    const body = {
      username: username,
      password: password
    }

    return this.http.post(`${this.URI}/login`, body)
  }

  resetPassword(email) {
    const body = {
      email: email
    }

    return this.http.put(`${this.URI}/reset_password`, body)
  }

  resetLink(email, key, new_password) {
    const body = {
      new_password: new_password
    }

    return this.http.post(`${this.URI}/reset_link?email=${email}&key=${key}`, body)
  }

  register(data) {
    const body = data

    return this.http.post(`${this.URI}/register`, body)
  }

  getAllRequests() {
    return this.http.get(`${this.URI}/requests`)
  }

  acceptRequest(username) {
    const body = {
      username: username
    }

    return this.http.put(`${this.URI}/permit`, body)
  }

  denyRequest(username) {
    const body = {
      username: username
    }

    return this.http.put(`${this.URI}/deny`, body)
  }

}
