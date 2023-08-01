import { Controller, Post, Body, UseInterceptors, UploadedFile, UseGuards, Put } from '@nestjs/common';
import { FileService } from './file.service';
import { DeleteObjRequestDto } from './dto/delete-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/utils';

export class UploadFileRequest {
  name: string;
  mimeType: string;
  userSlug?: string;
}

@ApiTags('File' )
@ApiBearerAuth()
@UseGuards(JWTAuthGuard)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadFile(file);
  }

  @Post('remove')
  remove(@Body() params: DeleteObjRequestDto) {
    return this.fileService.removeFile(params);
  }
}
