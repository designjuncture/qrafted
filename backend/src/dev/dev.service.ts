import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { QrCode } from '../qr/qr-code.entity';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import { Subscription } from '../subscriptions/subscription.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DevService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(QrCode) private qrRepo: Repository<QrCode>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Subscription) private subscriptionRepo: Repository<Subscription>,
  ) {}

  async seedAll() {
    await this.orderItemRepo.delete({});
    await this.orderRepo.delete({});
    await this.subscriptionRepo.delete({});
    await this.qrRepo.delete({});
    await this.productRepo.delete({});
    await this.userRepo.delete({});

    const hashed = await bcrypt.hash('qrafted123', 10);
    const user = await this.userRepo.save({ email: 'demo@qrafted.io', password: hashed });

    const sub = await this.subscriptionRepo.save({
      user_id: user.id,
      plan_name: 'Pro',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    const qr = await this.qrRepo.save({
      user_id: user.id,
      title: 'Qrafted Demo QR',
      data: 'https://qrafted.io',
      style: { color: '#000000', shape: 'square' },
    });

    const prod = await this.productRepo.save({
      name: 'Custom Mug',
      description: 'A printed coffee mug with QR code.',
      base_price: 299.99,
      category: 'Mug',
    });

    const order = await this.orderRepo.save({
      user_id: user.id,
      total_amount: 299.99,
      status: 'paid',
    });

    await this.orderItemRepo.save({
      order_id: order.id,
      product_id: prod.id,
      qr_code_id: qr.id,
      quantity: 1,
      price: 299.99,
    });

    return { message: '✅ Seeded demo data successfully' };
  }
}
