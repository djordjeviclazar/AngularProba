import { Injectable } from '@angular/core';

import {  Hero } from './hero';
// import { HEROES } from './mock-heroes';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';
  httpOptions = { headers: new HttpHeaders({ 'Content-Type' : 'application/json'}) };

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  // prikaz greške:
  private handleError<T>(operation = 'operation', result?: T){
    return (error: any): Observable<T> =>{
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T); // ne vraća ništa da bi aplikacija nastavila da radi
    }
  }

  //prikaz poruke:
  private log(message: string){
    this.messageService.add(`Hero service: ${message}`);
  }

  getHeroes(): Observable<Hero[]>{
    // this.messageService.add('HeroService: fetched heroes'); // *(1)
    // return of(HEROES);

    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(_ => this.log('fetched heroes')), // modifikuje prikaz (dodaje `fetched heroes`), umesto (1)
      catchError(this.handleError<Hero[]>('getHeroes', [])) // prikaz greške
    );
  }

  getHero(id: number): Observable<Hero>{
    // this.messageService.add(`HeroService: fetched hero id = ${id}`); // *(2)
    // return of(HEROES.find(a => a.id === id));

    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(

      tap(_ => this.log(`fetched hero id = ${id}`)), /// umesto (2)
      catchError(this.handleError<Hero>('getHero'))
    )
  }

  updateHero(hero: Hero): Observable<any>{
    return this.http.put<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(

      tap(_ => this.log(`updated hero id = ${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    )
  }

  addHero(hero: Hero): Observable<Hero> {

    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(

      tap(newHero => this.log(`added hero id = ${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );

  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    //console.log('Echo');

    const id = typeof hero === 'number' ? hero : hero.id; // ako je prosleđen objekat onda pamti samo id
    const url = `${this.heroesUrl}/${id}`;

    console.log(id);
    console.log(url);

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id = ${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    )
    // console.log(a);

    // return of({id: id, name: ''});
  }

  searchHero(word: string): Observable<Hero[]>{
    if (!word.trim){ return of([]); }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${word}`).pipe(
      tap(a => a.length ?
          this.log(`found heroes matching "${word}"`) :
          this.log(`heroes matching "${word}" don't found`)),
      catchError(this.handleError<Hero[]>('searchHero'))
    );
  }

}
