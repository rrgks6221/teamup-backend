import { TSID } from 'tsid-ts';

export const generateEntityId = () => TSID.create().number.toString();
