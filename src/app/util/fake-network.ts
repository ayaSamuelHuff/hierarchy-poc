import { delay, Observable, of } from 'rxjs';
import { randomNumber } from './random-number';

export const fakeNetwork = <T = any>(
  data: Observable<T> | T,
  minDelay: number = 100,
  maxDelay: number = 1000
) => {
  data = data instanceof Observable ? data : of(data)

  return data.pipe(delay(randomNumber(maxDelay, minDelay)));
};

