import {ShoppingClientStore} from './shopping-client-store';
import {ShoppingStorage} from './shopping-storage';

export const ShoppingClient = new ShoppingClientStore(new ShoppingStorage());
