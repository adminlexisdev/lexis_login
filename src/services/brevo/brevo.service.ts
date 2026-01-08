import { Injectable, Logger } from '@nestjs/common';
import * as Brevo from '@getbrevo/brevo';

const logger = new Logger('BrevoService');

@Injectable()
export class BrevoService {
  apiInstance: any;
  constructor() {
    const apiKey = process.env.BREVO_API_KEY;

    this.apiInstance = new Brevo.TransactionalEmailsApi();
    this.apiInstance.setApiKey(0, apiKey);
  }

  sendMail(sendTo: string, templateId: number, params: Record<string, any>) {
    try {
      this.apiInstance
        .sendTransacEmail({
          to: [
            {
              email: sendTo,
            },
          ],
          templateId: templateId,
          params,
        })
        .then((response: any) => {
          logger.log('EMAIL SENT SUCCESSFULLY: ', response?.body?.messageId);
        })
        .catch((error: any) => {
          logger.log('ERROR SENDING EMAIL: ', error);
        });
    } catch (error) {
      logger.log('ERROR SENDING EMAIL: ', error);
    }
  }
}
