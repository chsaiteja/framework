
/** Angular imports */
import { Injectable } from '@angular/core';

/** Rxjs imports */
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
/** This service is used to track all the popup events and dispatch click events */
export class EventDispatchService {

        constructor() { }

        trackEvnt: Subject<Event> = new Subject<Event>();

        // Below method used to dispatch events.
        dispatch(data: Event) {
                // console.log('Event dispatch service event dispatched:' + data.type);
                this.trackEvnt.next(data);
        }

        // Below method is used to listen to the dispatched events.
        // We have to use .subscribe() to track the method success callback in calledcall.
        listen(): Observable<Event> {
                // console.log('Event dispatch service event listened:' + Event);
                return this.trackEvnt.asObservable();
        }
}