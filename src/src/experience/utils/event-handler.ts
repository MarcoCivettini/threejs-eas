import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export class EventHandler {
    private static event = new Subject<EventPayload>();

    static emit(eventName: string, value?: any): void {
        this.event.next({ name: eventName, value });
    }

    static register(name: string): Observable<any> {
        return this.event.asObservable().pipe(
            filter(x => x.name === name),
            map(x => x?.value)
        );
    }
}

interface EventPayload {
    name: string;
    value?: any;
}