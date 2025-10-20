import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Eureka from 'eureka-js-client';
@Module({})
export class EurekaModule implements OnModuleInit, OnModuleDestroy {
  private eurekaClient: Eureka;

  onModuleInit() {
    this.eurekaClient = new Eureka({
      instance: {
        app: 'service-nest-login', // Your application name
        hostName: 'localhost',
        ipAddr: 'localhost',
        statusPageUrl: 'http://localhost:3000/status',
        port: {
          $: 3000,
          '@enabled': true,
        },
        vipAddress: 'service-nest-login',
        dataCenterInfo: {
          '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
          name: 'MyOwn',
        },
      },
      eureka: {
        host: 'localhost',
        port: 8761, // Eureka server port
        //servicePath: '/eureka/apps/',
      },
    });

    this.eurekaClient.start((error) => {
      console.log('Eureka registration complete', error || '');
    });
  }

  onModuleDestroy() {
    if (this.eurekaClient) {
      this.eurekaClient.stop();
    }
  }
}
