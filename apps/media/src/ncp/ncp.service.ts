import * as fs from 'fs';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';
import { ErrorMessage } from '@repo/types';

import { NcpConfig } from './ncp.config';

@Injectable()
export class NcpService {
  private s3: S3Client;

  constructor(
    private ncpConfig: NcpConfig,
    private configService: ConfigService
  ) {
    this.s3 = ncpConfig.s3Client;
  }

  async uploadFile(
    localFilePath: string,
    remoteFileName: string,
    ticleId: string
  ): Promise<string> {
    const bucketName = this.configService.get<string>('NCP_OBJECT_STORAGE_BUCKET');

    const fileStream = fs.createReadStream(localFilePath);
    const params = {
      Bucket: bucketName,
      Key: remoteFileName,
      Body: fileStream,
    };

    try {
      await this.s3.send(new PutObjectCommand(params));
      const serverURL = this.configService.get<string>('VITE_API_URL');
      //todo 예외처리
      await fetch(`${serverURL}/stream/audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticleId, audioUrl: remoteFileName }),
      });
      return remoteFileName;
    } catch (error) {
      throw new Error(ErrorMessage.FILE_UPLOAD_FAILED);
    }
  }
}
