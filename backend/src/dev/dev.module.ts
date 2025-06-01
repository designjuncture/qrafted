import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevController } from './dev.controller';
import { DevService } from './dev.service';
import { User } from '../users/user.entity';
import { QrCode } from '../qr/qr-code.entity'; // if using
import { Product } from '../products/product.entity'; // if using
import { Order } from '../orders/order.entity'; // if using
import { OrderItem } from '../orders/order-item.entity'; // if using
import { Subscription } from '../subscriptions/subscription.entity'; // if using

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      QrCode,
      Product,
      Order,
      OrderItem,
      Subscription,
    ]),
  ],
  controllers: [DevController],
  providers: [DevService],
})
export class DevModule {}
