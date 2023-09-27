import { Component, OnInit } from '@angular/core';
import { Parkinginfo } from '../common/parkinginfo';
import { ParkingService } from '../services/parking.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-parkings',
  templateUrl: './parkings.component.html',
  styleUrls: ['./parkings.component.css'],
})
export class ParkingsComponent implements OnInit {
  parkings: Parkinginfo[] = [];
  isLoaded: boolean = false;

  constructor(private parkingService: ParkingService) {}

  ngOnInit(): void {
    this.loadParkingsData();
  }

  loadParkingsData(): void {
    forkJoin([
      this.parkingService.getParkings(),
      this.parkingService.getAddressParkings(),
    ]).subscribe((data) => {
      // Concat Data sur un seul tableau
      const concatData = data[0].concat(data[1]);
     // console.log(concatData);
      let id: number,
        nbPlacesVoiture;
      let nom,
        adresse;
      let obj:Parkinginfo;
      let parkingsTmp: Parkinginfo[] = [];
      for (let i: number = 0; i < concatData.length; i++) {
        id = concatData[i].id;
        nom = concatData.find(function (element) {
          if (element.nom && element.id === id){
            return element.nom;
          }
          return '';
        });
        adresse = concatData.find(function (element) {
          if (element.adresse && element.id === id){
            return element.adresse;
          }
          return '';
        });
        nbPlacesVoiture = concatData.find(function (element) {
          if (element.nbPlacesVoiture && element.id === id){
            return element.nbPlacesVoiture;
          }
          return 0;
        });
        obj = {
          id: Number(id),
          nom:nom?.nom,
          nbPlacesVoiture: Number(nbPlacesVoiture?.nbPlacesVoiture), 
          adresse:adresse?.adresse,
        } 
        parkingsTmp.push(obj);
      }

      // console.log(parkingsTmp);
      this.parkings = parkingsTmp;
    });
  }
}
