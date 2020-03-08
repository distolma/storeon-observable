import { StoreonEvent } from '../index'

// Typescript types casting checking.

interface Events {
  'inc': number;
  'sum': string;
}

const x1: StoreonEvent<Events, 'inc'> = {
  payload: 2,
  type: 'inc'
}

const x2: StoreonEvent<Events, 'sum'> = {
  type: 'sum',
  payload: 'a'
}

const x3: StoreonEvent<Events> = {
  type: 'sum',
  payload: 2
}

export const z1: StoreonEvent<Events> = x1
export const z2: StoreonEvent<Events> = x2
