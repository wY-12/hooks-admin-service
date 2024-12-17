import { SetMetadata } from '@nestjs/common';

export const TOKEN_METADATA_KEY = 'token';
export const Token = () => SetMetadata(TOKEN_METADATA_KEY, true);