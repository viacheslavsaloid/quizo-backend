import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { AppError } from '../models';
import { applyDecorators } from '@nestjs/common';

export const Swagger = type => applyDecorators(ApiCreatedResponse({ type }), ApiBadRequestResponse({ type: AppError }));
