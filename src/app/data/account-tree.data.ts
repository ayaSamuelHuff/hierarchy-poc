import { Account, Named } from '../model/account';
import { randomNumber } from '../util/random-number';

let _id = 1;

const noChildren = (): Account[] => [];

const createAccount = (
  name: string,
  createChildren?: (a: Account) => Account[],
  parentId?: number
) => {
  const id = _id;
  _id++;

  const a: Account = {
    parentId,
    id,
    name,
    facilities: randomFrom(facilities),
    services: randomFrom(services),
    children: [],
    hasChildren: false,
  };

  if (createChildren) {
    a.children = createChildren(a);
    a.hasChildren = a.children.length > 0;
  }

  return a;
};

const randomFrom = (opt: string[]): Named[] => {
  const count = randomNumber(5);

  const v = new Set<string>();

  for (var i = 0; i < count; ++i) {
    v.add(opt[randomNumber(opt.length - 1)]);
  }

  return Array.from(v).map((x) => {
    return {
      name: x,
    };
  });
};

const facilities = [
  'Crystal Heights',
  'Harborview Tower',
  'Eclipse Plaza',
  'Midtown Exchange',
  'Skyline Residences',
  'Aurora Gardens',
  'Harmony House',
  'Summit Tower',
  'Ocean Breeze Apartments',
  'CityScape Complex',
  'Starlight Lofts',
  'Pineview Manor',
  'The Atrium',
  'Riverside Flats',
  'Emerald Heights',
  'Grandview Place',
  'Cascade Court',
  'Sunset Villas',
  'Whispering Pines',
  'Falcon Tower',
  'Infinity Tower',
  'The Pinnacle',
  'Urban Oasis',
  'Regal Residences',
  'Meadowbrook Estates',
  'Nova Apartments',
  'Parkside Manor',
  'Vista Ridge',
  'Timberline Terrace',
  'Silverleaf Condos',
];

const services = [
  'Locums',
  'Travel Nurse',
  'Permanent',
  'Leadership',
  'Assistant',
  'Something Else',
];

export const accounts: Account[] = [
  createAccount('SolarisInnovations', (a) => [
    createAccount('SolarTech Labs', noChildren, a.id),
    createAccount('BrightEnergy Solutions', noChildren, a.id),
  ]),
  createAccount('Neoniverse Studios', (a) => [
    createAccount('PixelPerfect Productions', noChildren, a.id),
  ]),
  createAccount('AquaPure Enterprises', (a) => [
    createAccount('CrystalClear Water Co', noChildren, a.id),
    createAccount('AquaFilter Solutions', noChildren, a.id),
  ]),
  createAccount('Quantum Motors', (a) => [
    createAccount('ElectroDrive Systems', noChildren, a.id),
  ]),
  createAccount('Luna Luxe', (a) => [
    createAccount('MoonGlow Cosmetics', noChildren, a.id),
    createAccount('Celestial Skincare', noChildren, a.id),
  ]),
  createAccount('EgoWave Technologies', noChildren),
  createAccount('NovaGen Pharma', (a) => [
    createAccount('BioHealth Labs', noChildren, a.id),
    createAccount('Medica Innovations', noChildren, a.id),
  ]),
  createAccount('GreenThumb Agriculture'),
  createAccount('Aurora Aerospace'),
  createAccount('UrbanVibe Architects'),
];
