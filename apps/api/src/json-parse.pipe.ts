import { Injectable, PipeTransform } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common/interfaces/features/pipe-transform.interface';

@Injectable()
export class JsonParsePipe implements PipeTransform {
  private readonly additionalFields: string[];
  constructor(fields: string[] = []) {
    this.additionalFields = fields;
  }
  transform(
    value: Record<string, unknown> | string,
    metadata: ArgumentMetadata,
  ) {
    if (metadata.type !== 'body') {
      return value;
    }

    const parsedData = typeof value === 'string' ? JSON.parse(value) : value;
    if (this.additionalFields.length) {
      this.additionalFields.forEach((field) => {
        if (parsedData[field] && typeof parsedData[field] === 'string') {
          parsedData[field] = JSON.parse(parsedData[field]);
        }
      });
    }
    Object.keys(parsedData).forEach((key) => {
      if (parsedData[key] === 'null') {
        parsedData[key] = null;
      }
    });
    if (typeof parsedData !== 'object') {
      throw new Error();
    }
    return parsedData;
  }
}
