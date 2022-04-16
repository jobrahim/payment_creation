import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { PaymentDto } from './dto/payment.dto';
import convert = require('xml-js');
import xml2js = require('xml2js');
import { EntityManager } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly repository: EntityManager,
    @Inject('ORDERS_ENTITY')
    private readonly orderEntity: ClientProxy,
    @Inject('PAYMENT_COTIZATE')
    private readonly paymentCotizate: ClientProxy,
  ) {}

  // *********************** Crea la Coordinacion en N4 ********************
  async createPayments(jsonMsg: PaymentDto, userIde: string): Promise<any> {
    console.log({ jsonMsg });
    console.log('---------------------  Json  ------------------------------');
    jsonMsg.userId = jsonMsg.userId === undefined ? userIde : jsonMsg.userId;
    jsonMsg.orders.userId =
      jsonMsg.orders.userId === undefined ? userIde : jsonMsg.orders.userId;

    console.log({ jsonMsg });
    console.log('----------------------------------------------------------');

    // ------- URL para usar en Axios
    const urlLlamado = `${process.env.PAYMENT_URL}payment`;
    // ------- Conversion de Data Json a Xml
    const jsonEnvuelto = { Payment: jsonMsg };
    const options = { ignoreComment: true, compact: true, spaces: 4 };
    const dataXML = convert.js2xml(jsonEnvuelto, options);
    // ------- Config para Axios header para que interprete que le envio un XML
    const config = { headers: { 'Content-Type': 'xml' } };
    // ------- Llamado y destructuracion en status y data que viene en XML
    const { status, data } = await axios.post(urlLlamado, dataXML, config);

    console.log(
      '******************* Msg Json ********************************',
    );

    //
    let respuesta;
    let pasajeJson;
    const parser = new xml2js.Parser({ trim: true, explicitArray: false });
    parser.parseString(data, (err, resultado) => {
      pasajeJson = resultado;
      console.log(pasajeJson);
    });
    console.log(
      '*************************************************************',
    );

    if (status === 200) {
      // *********************** Se persiste id de payment en tabla ORDER SERVICE  ********************

      await this.orderEntity
        .send<any>(
          { cmd: 'update-billing-payment' },
          {
            idPayment: pasajeJson.Payment.id,
            orders: jsonMsg.orders,
          },
        )
        .toPromise();

      respuesta = { status, pasajeJson };
    } else {
      respuesta = {
        status,
        dataJSON: {
          msg: 'Error en la respuesta del servicio',
          statusOfService: status,
        },
      };
      // console.log('Respuesta', respuesta);
    }

    return respuesta;
  }

  async cotizatePayment(idPayment: number, userId: string) {
    const payment = await this.paymentCotizate
      .send<any>(
        { cmd: 'valorizate-integration' },
        { userId: userId, idPayment: idPayment },
      )
      .toPromise();
    return payment;
  }
}
