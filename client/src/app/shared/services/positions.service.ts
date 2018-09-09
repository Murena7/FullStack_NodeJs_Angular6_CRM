import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Position, Message } from './../interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PositionsService {
  constructor(private http: HttpClient) {

  }

  public fetch(categoryId: string): Observable<Position[]> {
    return this.http.get<Position[]>(`/api/position/${categoryId}`);
  }

  public create(position: Position): Observable<Position> {
    return this.http.post<Position>('/api/position', position);
  }

  public update(position: Position): Observable<Position> {
    return this.http.patch<Position>(`/api/position/${position._id}`, position);
  }

  public delete(position: Position): Observable<Message> {
    return this.http.delete<Message>(`/api/position/${position._id}`);
  }
}
