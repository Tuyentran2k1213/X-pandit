import { ApiProperty } from '@nestjs/swagger';

export class DeleteObjRequestDto {
  @ApiProperty()
  Bucket: string;

  @ApiProperty()
  Key: string;

  @ApiProperty()
  VersionId?: string;
}