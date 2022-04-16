import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class OrdersDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  sapClient: string;

  @ApiProperty()
  @IsEnum(
    [
      'IMPO',
      'EXPO',
      'CFS',
      'SERV_ORDER',
      'SORDER_IMC',
      'SORDER_IMB',
      'SORDER_IMA',
      'DFI',
      'PLA',
    ],
    {
      message:
        '- Bad: type, value error. Valid name: IMPO, EXPO, CFS, SERV_ORDER, SORDER_IMC, SORDER_IMB, SORDER_IMA, DFI, PLA',
    },
  )
  type: operationTypeEnum;

  @ApiProperty()
  @IsString()
  unitNbr: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  userId: string;

  @ApiProperty()
  @IsString()
  vesselCall: string;

  @ApiProperty()
  @IsString()
  vesselId: string;

  @ApiProperty()
  @IsString()
  vesselVoyage: string;
}

export class PaymentDto {
  @ApiProperty()
  @IsEnum(
    [
      'IMPO',
      'EXPO',
      'CFS',
      'SERV_ORDER',
      'SORDER_IMC',
      'SORDER_IMB',
      'SORDER_IMA',
      'DFI',
      'PLA',
    ],
    {
      message:
        'Bad type value error. Valid name: IMPO, EXPO, CFS, SERV_ORDER, SORDER_IMC, SORDER_IMB, SORDER_IMA, DFI, PLA',
    },
  )
  type: operationTypeEnum;

  @ApiProperty()
  @IsEnum(
    [
      'NUEVO',
      'PENDIENTE',
      'PAGADO',
      'FACTURADO',
      'VENCIDO',
      'ANULADO',
      'RECHAZADO',
      'AUTORIZADO',
    ],
    {
      message:
        'Bad status value error. Valid name: NUEVO, PENDIENTE, PAGADO, FACTURADO, VENCIDO, ANULADO, RECHAZADO, AUTORIZADO',
    },
  )
  status: paymentStatusEnum;

  @ApiProperty()
  @IsString()
  @IsOptional()
  userId: string;

  @ApiProperty()
  @IsString()
  expirationDate: string;

  @ApiProperty()
  @IsString()
  collectingAccount: string;

  @ApiProperty()
  @IsString()
  paymentCuit: string;

  @ApiProperty()
  @IsString()
  money: string;

  @ApiProperty()
  @IsEnum(['CASH', 'ELECTRONIC', 'CURRENT_ACCOUNT'], {
    message:
      'Bad paymentMethodEnum value error. Valid name: CASH, ELECTRONIC, CURRENT_ACCOUNT',
  })
  paymentMethod: paymentMethodEnum;

  @ApiProperty({ type: () => [OrdersDto] })
  @Type(() => OrdersDto)
  @ValidateNested({ each: true })
  orders: OrdersDto;
}

enum operationTypeEnum {
  IMPO = 'IMPO',
  EXPO = 'EXPO',
  CFS = 'CFS',
  SERV_ORDER = 'SERV_ORDER',
  SORDER_IMC = 'SORDER_IMC',
  SORDER_IMB = 'SORDER_IMB',
  SORDER_IMA = 'SORDER_IMA',
  DFI = 'DFI',
  PLA = 'PLA',
}

enum paymentStatusEnum {
  NUEVO = 'NUEVO',
  PENDIENTE = 'PENDIENTE',
  PAGADO = 'PAGADO',
  FACTURADO = 'FACTURADO',
  VENCIDO = 'VENCIDO',
  ANULADO = 'ANULADO',
  RECHAZADO = 'RECHAZADO',
  AUTORIZADO = 'AUTORIZADO',
}

enum paymentMethodEnum {
  CASH = 'CASH',
  ELECTRONIC = 'ELECTRONIC',
  CURRENT_ACCOUNT = 'CURRENT_ACCOUNT',
}

enum SapClientTypeEnum {
  CREADO = 'CREADO',
  DISPONIBLE = 'DISPONIBLE',
  ASOCIADO = 'ASOCIADO',
  FINALIZADO = 'FINALIZADO',
  ANULADO = 'ANULADO',
  SINCOSTO = 'SINCOSTO',
  ERROR = 'ERROR',
}
