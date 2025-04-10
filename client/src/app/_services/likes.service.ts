import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../_models/Member';
import { PaginatedResult } from '../_models/Pagination';
import { setPaginatedResponse, setPaginationHeaders } from './PaginationHelper';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  baserUrl = environment.apiUrl;
  private http = inject(HttpClient);
  likeIds = signal<number[]>([]);
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);

  toggleLike(targetId: number){
    return this.http.post(this.baserUrl + 'likes/' + targetId, {})
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number){
    let params = setPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);

    return this.http.get<Member[]>(this.baserUrl + 'likes', 
      {observe: 'response', params}).subscribe({
        next: response => setPaginatedResponse(response, this.paginatedResult)
      });
  }

  getLikeIds(){
    return this.http.get<number[]>(this.baserUrl + 'likes/list').subscribe({
      next: ids => this.likeIds.set(ids)
    })
  }
}
