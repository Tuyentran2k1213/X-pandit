import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AWS_S3_Service, DeleteObjRequest } from 'src/utils';
import { S3 } from 'aws-sdk';

@Injectable()
export class FileService {
  constructor(private readonly awsS3Service: AWS_S3_Service){}

  async uploadFile(file: Express.Multer.File) {
    try {
      const uploaded = await this.awsS3Service.uploadS3(file);
      return uploaded;
    } catch(err) {
      throw new HttpException('error', HttpStatus.FORBIDDEN, { cause: err });
    }
  }

  async removeFile(params: DeleteObjRequest): Promise<S3.DeleteObjectOutput> {
    try{
      const deletedResult = await this.awsS3Service.deleteS3(params);
      return deletedResult;
    } catch(err){
      throw new HttpException('error', HttpStatus.FORBIDDEN, { cause: err });
    }
  }
}
