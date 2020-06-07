import { Component, OnInit } from '@angular/core';

import { Observable, Subject, VirtualTimeScheduler } from 'rxjs';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$: Observable<Hero[]>
  private searchWords = new Subject<string>();

  constructor(
    private heroService: HeroService
  ) { }

  ngOnInit() {
    this.heroes$ = this.searchWords.pipe(
      debounceTime(300), // čekaj 300 ms nakon svakog klika na taster
      distinctUntilChanged(), // ignoriši reč ako je ostala ista
      switchMap((word: string) => this.heroService.searchHero(word)) // poziva searchHero za sve što prođe
      // prethodne dve metode
      // vraća samo poslednji search
    );
  }

  search(word: string): void{

    if (!word.trim) { return; }

    this.searchWords.next(word);
  }

}
