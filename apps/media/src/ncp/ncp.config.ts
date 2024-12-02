import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NcpConfig {
  s3Client: S3Client;

  constructor(private configService: ConfigService) {
    const accessKeyId = this.configService.get<string>('NCP_ACCESS_KEY');
    const secretAccessKey = this.configService.get<string>('NCP_SECRET_KEY');
    const region = this.configService.get<string>('NCP_OBJECT_STORAGE_REGION');
    const endpoint = this.configService.get<string>('NCP_OBJECT_STORAGE_ENDPOINT');

    this.s3Client = new S3Client({
      region: region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
      endpoint: endpoint,
      forcePathStyle: true,
    });
  }
}
