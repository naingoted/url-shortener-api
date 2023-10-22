import { Injectable } from '@nestjs/common';
import ShortUniqueId from 'short-unique-id';

@Injectable()
export class HelperService {
  private readonly uid: ShortUniqueId;
  constructor() {
    this.uid = new ShortUniqueId({
      length: parseInt(process.env.SHORT_ID_LENGTH),
    });
  }

  generateShortUrl(): string {
    return `${this.uid.randomUUID()}`;
  }
}
