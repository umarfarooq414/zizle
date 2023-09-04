/* eslint-disable quotes */
import { version } from 'package.json';
import { registerAs } from '@nestjs/config';
import { ConfigEnum } from '@lib/types';

export default registerAs(ConfigEnum.SWAGGER, () => ({
  title: process.env.SWAGGER_TITLE || 'Zizle',
  description: process.env.SWAGGER_DESCRIPTION || `Zizle Rest api's documentation`,
  version: version || '1.0.0',
}));
