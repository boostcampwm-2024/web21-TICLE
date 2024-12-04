import * as fs from 'fs';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorMessage } from '@repo/types';

import { NcpConfig } from '@/config/ncp.config';

@Injectable()
export class NcpService {
  private s3: S3Client;

  constructor(
    private ncpConfig: NcpConfig,
    private configService: ConfigService
  ) {
    this.s3 = ncpConfig.s3Client;
  }

  async uploadFile(localFilePath: string, remoteFileName: string): Promise<string> {
    const bucketName = this.configService.get<string>('NCP_OBJECT_STORAGE_BUCKET');
    const endpoint = this.configService.get<string>('NCP_OBJECT_STORAGE_ENDPOINT');

    try {
      const fileStream = fs.createReadStream(localFilePath);
      const params = {
        Bucket: bucketName,
        Key: remoteFileName,
        Body: fileStream,
      };
      const uploadResponse = await this.s3.send(new PutObjectCommand(params));
      const url = `${endpoint}/${bucketName}/${remoteFileName}`;
      return remoteFileName;
    } catch (error) {
      throw new Error(ErrorMessage.FILE_UPLOAD_FAILED);
    }
  }
}
