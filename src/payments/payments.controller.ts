import {
  Controller,
  Body,
  Res,
  HttpStatus,
  Put,
  UseGuards,
  Query,
  Param,
  Get,
  Req,
  ValidationPipe,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentDto } from './dto/payment.dto';

@ApiBearerAuth()
@ApiTags('Create Payments')
@Controller('/create-payment')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * PUT
   * Este endpoint invoca el endpoint rest xml
   * Actualizar el booking, crear el appointmente en N4 y preavisar el contenedor, carga los permisos embraque, generar los items facturables.
   * @param response
   * @Body dataJson
   * @Query params (idOperation, eMail, userName)
   */
  @ApiOperation({
    summary:
      'Actualizar el booking, crear el appointmente en N4 y preavisar el contenedor, carga los permisos embraque y generar los items facturables.',
  })
  @ApiResponse({
    status: 200,
    description: 'Crea Payments llamando al servicio de N4',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/payment')
  async crearBck(
    @Req() req,
    @Res() response,
    @Body(new ValidationPipe()) dataJson: PaymentDto,
  ) {
    let userId = 'superadmin';
    if (req.user) {
      userId = req.user.userId;
    }

    try {
      const data = await this.paymentsService.createPayments(dataJson, userId);
      response.status(HttpStatus.OK).json({
        statusCode: data.status,
        message: 'OK',
        Data: data.pasajeJson,
      });
    } catch (e) {
      throw e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create-cotizate')
  async createAndCotizate(
    @Req() req,
    @Res() response,
    @Body(new ValidationPipe()) dataJson: PaymentDto,
  ) {
    let userId;
    if (req.user) {
      console.log('user: ', req.user);
      userId = req.user.username;
    } else {
      new NotFoundException('User not found');
    }
    try {
      const data = await this.paymentsService.createPayments(dataJson, userId);
      const dataCotizate = await this.paymentsService.cotizatePayment(
        data.pasajeJson.Payment.id,
        userId,
      );
      response.status(HttpStatus.OK).json({
        message: 'OK',
        PaymentId: data.pasajeJson.Payment.id,
        data: dataCotizate.pasajeJson,
      });
    } catch (e) {
      throw e;
    }
  }
}
