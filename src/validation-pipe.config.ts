import {
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';

export const customValidationPipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,

  exceptionFactory(errors) {
    const [error] = errors;
    throw new UnprocessableEntityException({
      message: Object.values(error.constraints ?? {})[0],
      property: error.property,
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    });
  },
});
