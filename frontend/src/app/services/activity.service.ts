import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from '../utils/config';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private http: HttpClient) { }

  URI = `http://${Configuration.BACKEND_HOST}:${Configuration.BACKEND_PORT}/${Configuration.BACKEND_ACTIVITY_ROUTES}`

  getWorkshopComments(workshop) {
    let body = {
      workshop_id: workshop._id
    }

    return this.http.post(`${this.URI}/workshop_comments`, body)
  }

  like(workshop) {
    let body = {
      workshop_id: workshop._id
    }

    return this.http.put(`${this.URI}/like`, body)
  }

  unlike(workshop) {
    let body = {
      workshop_id: workshop._id
    }

    return this.http.put(`${this.URI}/unlike`, body)
  }

  sendComment(workshop_id, content) {
    let body = {
      workshop_id: workshop_id,
      content: content
    }

    return this.http.post(`${this.URI}/comment`, body)
  }

  getAllParticipantChatThreads() {

    return this.http.get(`${this.URI}/participant_threads`)
  }

  getThread(workshop) {
    let body = {
      workshop_id: workshop._id
    }

    return this.http.post(`${this.URI}/thread`, body)
  }

  createThread(workshop) {
    let body = {
      workshop_id: workshop._id
    }

    return this.http.post(`${this.URI}/create_thread`, body)
  }

  sendMessage(thread_id, content) {
    let body = {
      thread_id: thread_id,
      content: content
    }

    return this.http.post(`${this.URI}/message`, body)
  }
}
