import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Eureka from 'eureka-js-client';
@Module({})
export class EurekaModule implements OnModuleInit, OnModuleDestroy {
  private eurekaClient: Eureka;

  onModuleInit() {
    this.eurekaClient = new Eureka({
      instance: {
        app: 'service-nest-login', // Your application name
        hostName: process.env.EUREKA_INSTANCE_HOSTNAME,
        instanceId: `${process.env.EUREKA_INSTANCE_HOSTNAME}:${Math.random().toString(36).substr(2, 5)}`,
        ipAddr: process.env.EUREKA_INSTANCE_IP,
        statusPageUrl: process.env.EUREKA_INSTANCE_STATUS,
        port: {
          $: process.env.EUREKA_INSTANCE_PORT,
          '@enabled': true,
        },
        vipAddress: 'service-nest-login',
        dataCenterInfo: {
          '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
          name: 'MyOwn',
        },
      },
      eureka: {
        host: process.env.EUREKA_HOST,
        port: 8761,
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
