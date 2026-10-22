import { animate, query, style, transition, trigger, group } from '@angular/animations';

export const fadeRouteAnimation = trigger('fadeRouteAnimation', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }),
      ],
      { optional: true },
    ),
    group([
      query(
        ':leave',
        [animate('300ms ease-out', style({ opacity: 0, backgroundColor: '#FFFFFF' }))],
        { optional: true },
      ),
      query(
        ':enter',
        [style({ opacity: 0 }), animate('400ms 150ms ease-in', style({ opacity: 1 }))],
        { optional: true },
      ),
    ]),
  ]),
]);
