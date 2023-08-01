import { AWSError, S3 } from "aws-sdk";
import { Injectable } from "@nestjs/common";

import { awsServices } from "../enviroment-variables";
import { DeleteObjRequest } from "../types";

@Injectable()
export class AWS_S3_Service {
    private s3: S3;
    constructor() {
        this.s3 = new S3({
            region: awsServices.region,
            accessKeyId: awsServices.accessKeyId,
            secretAccessKey: awsServices.secretAccessKey,
        });
    }

    async uploadS3(file: Express.Multer.File): Promise<S3.ManagedUpload.SendData> {
        const bucketS3 = awsServices.imageBucketName;
        const current = new Date();
        const currentTime = current.getTime();
        const filename = `${currentTime}${file.originalname}`;

        const params = {
            Bucket: bucketS3,
            Key: String(filename),
            Body: file.buffer,
            ACL: 'public-read',
            ContentType: file.mimetype,
        }

        // Upload the file to aws-S3 storage
        return new Promise((resolve, reject) => {
            this.s3.upload(params, (err, data: S3.ManagedUpload.SendData) => {
                if(err){
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }

    async deleteS3(params: DeleteObjRequest): Promise<S3.DeleteObjectOutput> {
        return new Promise((resolve, reject) => {
            this.s3.deleteObject(params, (err: AWSError, data: S3.DeleteObjectOutput) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    }
}