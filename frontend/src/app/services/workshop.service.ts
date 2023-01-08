import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from '../utils/config';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {

  constructor(private http: HttpClient) { }

  URI = `http://${Configuration.BACKEND_HOST}:${Configuration.BACKEND_PORT}/${Configuration.BACKEND_WORKSHOP_ROUTES}`

  getAllWorkshops() {
    return this.http.get(`${this.URI}/all`)
  }

  getAllRequestsForOrganizing() {
    return this.http.get(`${this.URI}/requests`)
  }

  permitNewWorkshop(_id) {
    const body = {
      workshop_id: _id
    }

    return this.http.put(`${this.URI}/permit`, body)
  }

  deleteWorkshop(_id) {
    const body = {
      workshop_id: _id
    }

    return this.http.delete(`${this.URI}`, {body: body})
  }

  updateWorkshop(formData: FormData) {
    return this.http.put(`${this.URI}`, formData)
  }

  createWorkshop(formData: FormData) {
    return this.http.post(`${this.URI}`, formData)
  }
}
