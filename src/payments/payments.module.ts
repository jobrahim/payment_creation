import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [AuthModule, ConfigModule, HttpModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    {
      provide: 'ORDERS_ENTITY',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('OPERATION_ORDER_TCP_HOST'),
            port: configService.get('OPERATION_ORDER_TCP_PORT'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'PAYMENT_COTIZATE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('PAYMENT_COTIZATE_TCP_HOST'),
            port: configService.get('PAYMENT_COTIZATE_TCP_PORT'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class PaymentsModule {}
