import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { AWS_S3_Service } from 'src/utils';

@Module({
  controllers: [FileController],
  providers: [FileService, AWS_S3_Service]
})
export class FileModule {}
