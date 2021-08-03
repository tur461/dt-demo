import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IAirline_str, IAirline_arr } from '../domain/airline.domain';

@Injectable()
export class AirlineService {
    airlines: (IAirline_str &  IAirline_arr)[]=[];
    constructor(private http: HttpClient) {}

    getAirlines() {
        console.log('here');
        return this.http.get('../../../assets/data/data.json')
                    .toPromise()
                    .then(res => res)
                    .then(data => (<(IAirline_str & IAirline_arr)[]>data));
    }
}
