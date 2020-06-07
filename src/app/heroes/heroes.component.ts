import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
// import { HEROES } from '../mock-heroes';
import { HeroService } from '../hero.service';

import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  // hero: Hero = { id: 100, name: 'Proba'};
  heroes: Hero[];
  selectedHero: Hero;


  constructor(
    private heroService: HeroService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getHeroes();
    console.log(this);
  }

  isCrnac(hero: Hero): boolean{
    return hero.name === "CCCCCCCCCCRRRRRRRRRRRNNNNNNNNNNNNAAAAAAAAAAAACCCCCCCCCCCCC";
  }

  onSelect(hero: Hero): void{
    this.selectedHero = hero;
    this.messageService.add(`You selected ${hero.name} from list`);
  }

  getHeroes(){
    // sinhrono pribavljanje heroja:
    // this.heroes = this.heroService.getHeroes();

    //asinhrono -||-:
    this.heroService.getHeroes().subscribe(heroes =>{
      this.heroes = heroes;
    })
  }

  add(name: string){

    name = name.trim()
    if (!name) { return; }

    this.heroService.addHero({name} as Hero).subscribe(a => this.heroes.push(a));
  }

  delete(hero: Hero){
    // console.log('Echo');

    if (!hero) {

      console.log('Echo'); 
      return; 
    }

    // this.heroes.filter(k => k === hero);

    this.heroService.deleteHero(hero).subscribe((a => this.heroes = this.heroes.filter(k => k !== hero)));
    // ne radi: subscribe(a => this.heroes.filter(k => k === hero));
  }

}
