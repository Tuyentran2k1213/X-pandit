import { S3 } from "aws-sdk";

export type S3File = S3.ManagedUpload.SendData;
export type DeleteObjRequest = Pick<S3.Types.DeleteObjectRequest, 'Bucket' | 'Key' | 'VersionId'>;