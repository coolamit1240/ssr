import { Mongo } from 'meteor/mongo';
import {
  insertRandomPubSubItem,
  updatePubSubItem,
  removePubSubItem,
  valuesFromLastMod,
} from './methods';

const PubSub = new Mongo.Collection('PubSub');
const PubSubPublicationName = 'PubSub.public';

export default PubSub;
export {
  PubSubPublicationName,
  insertRandomPubSubItem,
  updatePubSubItem,
  removePubSubItem,
  valuesFromLastMod,
};
