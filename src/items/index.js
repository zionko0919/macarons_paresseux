import AlmondMac from './macaron_images/almondMac.jpg';
import BlackberryMac from './macaron_images/blackberryMac.jpg';
import LemonMac from './macaron_images/lemonMac.jpg';
import GreenteaMac from './macaron_images/greenteaMac.jpg';
import CaramelMac from './macaron_images/caramelMac.jpg';
import CherryMac from './macaron_images/cherryMac.jpg';
import GrapeMac from './macaron_images/grapeMac.jpg';
import MintMac from './macaron_images/mintMac.jpg';
import OrangeMac from './macaron_images/orangeMac.jpg';
import RaspberryMac from './macaron_images/raspberryMac.jpg';
import ChocolateMac from './macaron_images/chocolateMac.jpg';
import BlueBerryMac from './macaron_images/blueberryMac.jpg';
import Coffee from './drinks_image/coffee.jpg';
import IcedCoffee from './drinks_image/iced_coffee.jpg';
import Latte from './drinks_image/latte.jpg';
import Tea from './drinks_image/tea.jpg';
import Milk from './drinks_image/milk.jpg';
import SinglePack from './box_images/SinglePack.jpg';
import TwoPack from './box_images/TwoPack.jpg';
import FourPack from './box_images/FourPack.jpg';
import EightPack from './box_images/EightPack.jpg';
import TwelvePack from './box_images/TwelvePack.jpg';
import PartyPack from './box_images/PartyPack.jpg';

export const itemImages = {
  almond: AlmondMac,
  blackberry: BlackberryMac,
  lemon: LemonMac,
  greentea: GreenteaMac,
  caramel: CaramelMac,
  cherry: CherryMac,
  grape: GrapeMac,
  mint: MintMac,
  raspberry: RaspberryMac,
  orange: OrangeMac,
  chocolate: ChocolateMac,
  blueberry: BlueBerryMac,
  coffee: Coffee,
  icedcoffee: IcedCoffee,
  latte: Latte,
  tea: Tea,
  milk: Milk,
  singlepack: SinglePack,
  twopack: TwoPack,
  fourpack: FourPack,
  eightpack: EightPack,
  twelvepack: TwelvePack,
  partypack: PartyPack,
};

export const items = [
  {
    id: 0,
    itemId: 'almond',
    imageId: 'almond',
    title: 'Almond',
    price: 2.50,
    calories: 90,
    description: 'EGG, CREAM, ALMOND',
  },
  {
    id: 1,
    itemId: 'lemon',
    imageId: 'lemon',
    title: 'Lemon',
    price: 2.50,
    calories: 100,
    description: 'EGG, CREAM, ALMOND',
  },
  {
    id: 2,
    itemId: 'blackberry',
    imageId: 'blackberry',
    title: 'Blackberry',
    price: 2.50,
    calories: 100,
    description: 'EGG, CREAM, ALMOND',
  },
  {
    id: 3,
    itemId: 'greentea',
    imageId: 'greentea',
    title: 'Green Tea',
    price: 2.50,
    calories: 90,
    description: 'EGG, CREAM, ALMOND',
  },
  {
    id: 4,
    itemId: 'caramel',
    imageId: 'caramel',
    title: 'Caramel',
    price: 2.50,
    calories: 120,
    description: 'EGG, CREAM, ALMOND',
  },
  {
    id: 5,
    itemId: 'cherry',
    imageId: 'cherry',
    title: 'Cherry',
    price: 2.50,
    calories: 100,
    description: 'EGG, CREAM, ALMOND',
  },
  {
    id: 6,
    itemId: 'grape',
    imageId: 'grape',
    title: 'Grape',
    price: 2.50,
    calories: 100,
    description: 'EGG, CREAM, ALMOND',
  },
  {
    id: 7,
    itemId: 'mint',
    imageId: 'mint',
    title: 'Mint',
    price: 2.50,
    calories: 90,
    description: 'EGG, CREAM, ALMOND',
  },
  {
    id: 8,
    itemId: 'raspberry',
    imageId: 'raspberry',
    title: 'Raspberry',
    price: 2.50,
    calories: 100,
    description: 'EGG, CREAM, ALMOND',
  },
  {
    id: 9,
    itemId: 'orange',
    imageId: 'orange',
    title: 'Orange',
    price: 2.50,
    calories: 100,
    description: 'EGG, CREAM, ALMOND',
  },
  {
    id: 10,
    itemId: 'chocolate',
    imageId: 'chocolate',
    title: 'Chocolate',
    price: 2.50,
    calories: 110,
    description: 'EGG, CREAM, ALMOND',
  },
  {
    id: 11,
    itemId: 'blueberry',
    imageId: 'blueberry',
    title: 'Blueberry',
    price: 2.50,
    calories: 100,
    description: 'EGG, CREAM, ALMOND',
  },
];

export const drinkItems = [
  {
    itemId: 'coffee',
    imageId: 'coffee',
    title: 'Coffee',
    price: 3.00,
  },
  {
    itemId: 'icedcoffee',
    imageId: 'icedcoffee',
    title: 'Iced Coffee',
    price: 3.50,
  },
  {
    itemId: 'latte',
    imageId: 'latte',
    title: 'Caffé Latte',
    price: 4.00,
  },
  {
    itemId: 'tea',
    imageId: 'tea',
    title: 'Black Tea',
    price: 3.50,
  },
  {
    itemId: 'milk',
    imageId: 'milk',
    title: 'Fresh Milk',
    price: 3.00,
  },
];

export const macaronPack = [
  {
    itemId: 'singlePack',
    imageId: 'singlePack',
    title: 'Single Box',
    price: 2.50,
  },
  {
    itemId: 'twoPack',
    imageId: 'twoPack',
    title: '2-Pack Box',
    price: 4.50,
  },
  {
    itemId: 'fourPack',
    imageId: 'fourPack',
    title: '4-Pack Box',
    price: 8.00,
  },
  {
    itemId: 'eightPack',
    imageId: 'eightPack',
    title: '8-Pack Box',
    price: 14.50,
  },
  {
    itemId: 'twelvePack',
    imageId: 'twelvePack',
    title: '12-Pack Box',
    price: 20.00,
  },
  {
    itemId: 'partyPack',
    imageId: 'partyPack',
    title: '24-Pack Party Box',
    price: 32.00,
  },
];

export const optionalItems = [
  {
    itemId: 'giftwrap',
    title: 'Gift Wrap Option',
    price: 1.00,
  },
];
