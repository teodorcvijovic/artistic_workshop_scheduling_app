import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from '../utils/config';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {

  constructor(private http: HttpClient) { }

  URI = `http://${Configuration.BACKEND_HOST}:${Configuration.BACKEND_PORT}/${Configuration.BACKEND_WORKSHOP_ROUTES}`

  getMyCurrentWorkshops() {
    return this.http.get(`${this.URI}/participating`)
  }

  getMyPreviousWorkshops() {
    return this.http.get(`${this.URI}/participated_in_past`)
  }

  getAllWorkshops() {
    return this.http.get(`${this.URI}/all`)
  }

  getAllRequestsForOrganizing() {
    return this.http.get(`${this.URI}/requests`)
  }

  getAllActiveWorkshops() {
    return this.http.get(`${this.URI}/all_active`)
  }

  getTop5Workshops() {
    return this.http.get(`${this.URI}/top5`)
  }

  getWorkshopsOrganizedByMe() {
    return this.http.get(`${this.URI}/organized_by_me`)
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

  newWorkshopRequest(formData: FormData) {
    return this.http.post(`${this.URI}/new_request`, formData)
  }

  cancelParticipation(workshop_id) {
    const body = {
      _id: workshop_id
    }

    return this.http.put(`${this.URI}/cancel_pariticipation`, body)
  }

  applyForWorkshop(_id) {
    const body = {
      _id: _id
    }

    return this.http.post(`${this.URI}/apply`, body)
  }

  putMeInWaitingQueue(_id) {
    const body = {
      _id: _id
    }

    return this.http.post(`${this.URI}/queue`, body)
  }
}
